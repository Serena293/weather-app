import {
  allowGetOnly,
  getQueryValue,
  sendApiError,
  type ApiRequest,
  type ApiResponse,
} from "./_http";
import { getCities } from "../server/weather-api";

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<void> {
  if (!allowGetOnly(request, response)) return;

  try {
    const query = getQueryValue(request.query.query);
    const cities = await getCities(query, process.env.RAPIDAPI_KEY);
    response.status(200).json(cities);
  } catch (error) {
    sendApiError(response, error);
  }
}
