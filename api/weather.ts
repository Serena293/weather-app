import { ApiServiceError, getWeatherBundle } from "../server/weather-api";

function errorResponse(error: unknown): Response {
  const status = error instanceof ApiServiceError ? error.status : 500;
  const message =
    error instanceof ApiServiceError
      ? error.message
      : "The weather service is currently unavailable.";

  return Response.json({ error: message }, { status });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const weather = await getWeatherBundle(
      Number(url.searchParams.get("lat")),
      Number(url.searchParams.get("lon")),
      process.env.WEATHER_API_KEY
    );

    return Response.json(weather, {
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
