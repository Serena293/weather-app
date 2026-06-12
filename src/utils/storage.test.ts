import { describe, expect, it } from "vitest";
import type { WeatherEntry } from "../types";
import { mergeEntries, readEntries, upsertEntry } from "./storage";

function createStorage(initialValue: string | null) {
  let value = initialValue;

  return {
    getItem: () => value,
    setItem: (_key: string, nextValue: string) => {
      value = nextValue;
    },
    removeItem: () => {
      value = null;
    },
  };
}

function entry(id: string, favorite = false): WeatherEntry {
  const [lat, lon] = id.split(",").map(Number);

  return {
    id,
    isFavorite: favorite,
    weatherData: {
      name: "Test",
      coord: { lat, lon },
      main: {
        temp: 10,
        feels_like: 10,
        temp_min: 9,
        temp_max: 11,
        humidity: 50,
        pressure: 1000,
      },
      weather: [{ description: "cloudy", icon: "04d" }],
      wind: { speed: 2 },
      sys: { country: "GB" },
      timezone: 0,
    },
    forecastData: {
      list: [],
      city: { name: "Test", country: "GB", timezone: 0 },
    },
  };
}

describe("weather storage", () => {
  it("recovers from invalid JSON", () => {
    const storage = createStorage("not-json");
    expect(readEntries(storage, "entries")).toEqual([]);
    expect(storage.getItem()).toBeNull();
  });

  it("merges favorites without duplicates", () => {
    const normal = entry("1.0000,2.0000");
    const favorite = entry("1.0000,2.0000", true);

    expect(mergeEntries([normal], [favorite])).toEqual([favorite]);
  });

  it("refreshes an existing city without adding a duplicate", () => {
    const current = entry("1.0000,2.0000", true);
    const refreshed = {
      ...entry("1.0000,2.0000"),
      weatherData: { ...current.weatherData, name: "Updated" },
    };

    const result = upsertEntry([current], refreshed);
    expect(result).toHaveLength(1);
    expect(result[0].weatherData.name).toBe("Updated");
    expect(result[0].isFavorite).toBe(true);
  });
});
