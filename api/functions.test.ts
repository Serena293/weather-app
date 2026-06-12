import { afterEach, describe, expect, it } from "vitest";
import { GET as getCities } from "./cities";
import { GET as getWeather } from "./weather";

const originalRapidApiKey = process.env.RAPIDAPI_KEY;
const originalWeatherApiKey = process.env.WEATHER_API_KEY;

afterEach(() => {
  process.env.RAPIDAPI_KEY = originalRapidApiKey;
  process.env.WEATHER_API_KEY = originalWeatherApiKey;
});

describe("Vercel API functions", () => {
  it("returns a Web Response from the cities handler", async () => {
    delete process.env.RAPIDAPI_KEY;

    const response = await getCities(
      new Request("https://example.com/api/cities?query=Edinburgh")
    );

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "RAPIDAPI_KEY is not configured.",
    });
  });

  it("returns a Web Response from the weather handler", async () => {
    delete process.env.WEATHER_API_KEY;

    const response = await getWeather(
      new Request("https://example.com/api/weather?lat=55.9533&lon=-3.1883")
    );

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "WEATHER_API_KEY is not configured.",
    });
  });
});
