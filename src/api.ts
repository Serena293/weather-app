import type { GeoCity, WeatherBundle } from "./types";
import { getApiErrorMessage } from "./utils/errors";

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as unknown;
    throw new Error(
      getApiErrorMessage(
        payload,
        "The weather service is currently unavailable."
      )
    );
  }

  return response.json() as Promise<T>;
}

export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<GeoCity[]> {
  const params = new URLSearchParams({ query });
  const response = await requestJson<{ data: GeoCity[] }>(
    `/api/cities?${params.toString()}`,
    signal
  );

  return response.data;
}

export function fetchWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });

  return requestJson<WeatherBundle>(`/api/weather?${params.toString()}`, signal);
}
