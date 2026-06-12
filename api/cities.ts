import { ApiServiceError, getCities } from "../server/weather-api.js";

function errorResponse(error: unknown): Response {
  const status = error instanceof ApiServiceError ? error.status : 500;
  const message =
    error instanceof ApiServiceError
      ? error.message
      : "The city search service is currently unavailable.";

  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const cities = await getCities(
        url.searchParams.get("query") || "",
        process.env.RAPIDAPI_KEY
      );

      return Response.json(cities, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
