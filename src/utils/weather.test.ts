import { describe, expect, it } from "vitest";
import type { ForecastData, ForecastItem } from "../types";
import {
  formatCityHour,
  formatWindSpeed,
  getForecastDisplay,
  getLocationId,
} from "./weather";

function forecastItem(dt: number, temp: number): ForecastItem {
  return {
    dt,
    main: {
      temp,
      feels_like: temp,
      temp_min: temp,
      temp_max: temp,
      pressure: 1000,
      humidity: 50,
    },
    weather: [
      {
        main: "Clouds",
        description: "cloudy",
        icon: "04d",
      },
    ],
    wind: {
      speed: 1,
      deg: 0,
    },
    dt_txt: new Date(dt * 1000).toISOString(),
  };
}

describe("weather utilities", () => {
  it("creates a stable coordinate id", () => {
    expect(getLocationId(55.953251, -3.188267)).toBe("55.9533,-3.1883");
  });

  it("converts metric wind speed from m/s to km/h", () => {
    expect(formatWindSpeed(3.58)).toBe("13 km/h");
  });

  it("formats forecast hours in the city's timezone", () => {
    expect(formatCityHour(1_750_000_000, 7200)).toBe("17:00");
  });

  it("selects the forecast closest to local noon for each future day", () => {
    const forecast: ForecastData = {
      city: {
        name: "Test",
        country: "GB",
        timezone: 0,
      },
      list: [
        forecastItem(Date.UTC(2026, 5, 11, 9) / 1000, 10),
        forecastItem(Date.UTC(2026, 5, 12, 3) / 1000, 8),
        forecastItem(Date.UTC(2026, 5, 12, 12) / 1000, 15),
        forecastItem(Date.UTC(2026, 5, 13, 9) / 1000, 11),
        forecastItem(Date.UTC(2026, 5, 13, 15) / 1000, 14),
      ],
    };

    const result = getForecastDisplay(
      forecast,
      Date.UTC(2026, 5, 11, 8)
    );

    expect(result.todayForecast).toHaveLength(1);
    expect(result.dailyForecasts.map((item) => item.temp)).toEqual([15, 11]);
  });
});
