const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const REQUEST_TIMEOUT_MS = 10_000;
const CITY_CACHE_TTL_MS = 5 * 60 * 1000;

type CityResponse = {
  data: unknown[];
};

type FetchOptions = {
  serviceName: string;
  retryOnRateLimit?: boolean;
};

const cityCache = new Map<
  string,
  { expiresAt: number; response: CityResponse }
>();

export class ApiServiceError extends Error {
  readonly status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

function requiredKey(value: string | undefined, name: string): string {
  if (!value) {
    throw new ApiServiceError(`${name} is not configured.`, 500);
  }

  return value;
}

function getRetryDelay(response: Response): number {
  const retryAfter = Number(response.headers.get("retry-after"));
  return Number.isFinite(retryAfter)
    ? Math.min(Math.max(retryAfter * 1000, 1000), 3000)
    : 1100;
}

function getUpstreamErrorMessage(
  response: Response,
  serviceName: string
): string {
  if (response.status === 401 || response.status === 403) {
    return `${serviceName} rejected the API key or subscription.`;
  }

  if (response.status === 429) {
    return serviceName === "GeoDB Cities"
      ? "City search is temporarily rate-limited. Wait a moment and try again."
      : "The OpenWeather request limit has been reached. Try again later.";
  }

  return `${serviceName} is currently unavailable.`;
}

async function fetchJson<T>(
  url: URL,
  init: RequestInit | undefined,
  options: FetchOptions,
  attempt = 0
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (
      response.status === 429 &&
      options.retryOnRateLimit &&
      attempt === 0
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, getRetryDelay(response))
      );
      return fetchJson<T>(url, init, options, attempt + 1);
    }

    if (!response.ok) {
      throw new ApiServiceError(
        getUpstreamErrorMessage(response, options.serviceName),
        response.status === 429 ? 429 : 502
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiServiceError) throw error;

    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiServiceError(
        `${options.serviceName} took too long to respond.`,
        504
      );
    }

    throw new ApiServiceError(
      `${options.serviceName} could not be reached.`,
      502
    );
  }
}

export async function getCities(query: string, rapidApiKey?: string) {
  const normalizedQuery = query.trim().slice(0, 100);
  if (normalizedQuery.length < 2) {
    return { data: [] };
  }

  const cacheKey = normalizedQuery.toLocaleLowerCase("en");
  const cached = cityCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.response;
  }

  const url = new URL(GEO_API_URL);
  url.searchParams.set("namePrefix", normalizedQuery);
  url.searchParams.set("minPopulation", "40000");
  url.searchParams.set("sortDirectives", "-population");
  url.searchParams.set("limit", "10");

  const response = await fetchJson<CityResponse>(
    url,
    {
      headers: {
        "x-rapidapi-key": requiredKey(rapidApiKey, "RAPIDAPI_KEY"),
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      },
    },
    {
      serviceName: "GeoDB Cities",
      retryOnRateLimit: true,
    }
  );

  cityCache.set(cacheKey, {
    expiresAt: Date.now() + CITY_CACHE_TTL_MS,
    response,
  });

  return response;
}

export async function getWeatherBundle(
  latitude: number,
  longitude: number,
  weatherApiKey?: string
) {
  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new ApiServiceError("Invalid coordinates.", 400);
  }

  const apiKey = requiredKey(weatherApiKey, "WEATHER_API_KEY");
  const commonParams = {
    lat: String(latitude),
    lon: String(longitude),
    appid: apiKey,
    units: "metric",
    lang: "en",
  };

  const currentUrl = new URL(WEATHER_API_URL);
  const forecastUrl = new URL(FORECAST_API_URL);

  Object.entries(commonParams).forEach(([key, value]) => {
    currentUrl.searchParams.set(key, value);
    forecastUrl.searchParams.set(key, value);
  });

  const [current, forecast] = await Promise.all([
    fetchJson<unknown>(currentUrl, undefined, {
      serviceName: "OpenWeather",
    }),
    fetchJson<unknown>(forecastUrl, undefined, {
      serviceName: "OpenWeather",
    }),
  ]);

  return { current, forecast };
}
