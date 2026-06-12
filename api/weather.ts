import {
  allowGetOnly,
  getQueryValue,
  sendApiError,
  type ApiRequest,
  type ApiResponse,
} from "./_http";
import { getWeatherBundle } from "../server/weather-api";

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<void> {
  if (!allowGetOnly(request, response)) return;

  try {
    const latitude = Number(getQueryValue(request.query.lat));
    const longitude = Number(getQueryValue(request.query.lon));
    const weather = await getWeatherBundle(
      latitude,
      longitude,
      process.env.WEATHER_API_KEY
    );

    response.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");
    response.status(200).json(weather);
  } catch (error) {
    sendApiError(response, error);
  }
}
