import type { WeatherEntry } from "../types";
import { getLocationId } from "./weather";

export const SESSION_STORAGE_KEY = "weatherEntries";
export const FAVORITES_STORAGE_KEY = "favorites";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function normalizeEntry(value: unknown): WeatherEntry | null {
  if (!value || typeof value !== "object") return null;

  const entry = value as Partial<WeatherEntry>;
  const coordinates = entry.weatherData?.coord;

  if (
    !entry.weatherData ||
    !entry.forecastData ||
    !coordinates ||
    !Number.isFinite(coordinates.lat) ||
    !Number.isFinite(coordinates.lon)
  ) {
    return null;
  }

  return {
    id: getLocationId(coordinates.lat, coordinates.lon),
    weatherData: entry.weatherData,
    forecastData: entry.forecastData,
    isFavorite: Boolean(entry.isFavorite),
  };
}

export function readEntries(
  storage: StorageLike,
  key: string
): WeatherEntry[] {
  try {
    const rawValue = storage.getItem(key);
    if (!rawValue) return [];

    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      storage.removeItem(key);
      return [];
    }

    return parsed
      .map(normalizeEntry)
      .filter((entry): entry is WeatherEntry => entry !== null);
  } catch {
    storage.removeItem(key);
    return [];
  }
}

export function writeEntries(
  storage: StorageLike,
  key: string,
  entries: WeatherEntry[]
): void {
  try {
    storage.setItem(key, JSON.stringify(entries));
  } catch {
    // Storage may be unavailable or full; the in-memory app still works.
  }
}

export function mergeEntries(
  sessionEntries: WeatherEntry[],
  favoriteEntries: WeatherEntry[]
): WeatherEntry[] {
  const entries = new Map<string, WeatherEntry>();

  sessionEntries.forEach((entry) => entries.set(entry.id, entry));
  favoriteEntries.forEach((entry) => {
    entries.set(entry.id, { ...entry, isFavorite: true });
  });

  return Array.from(entries.values());
}

export function upsertEntry(
  entries: WeatherEntry[],
  newEntry: WeatherEntry
): WeatherEntry[] {
  const existing = entries.find((entry) => entry.id === newEntry.id);
  const entry = {
    ...newEntry,
    isFavorite: existing?.isFavorite || newEntry.isFavorite,
  };

  if (!existing) return [...entries, entry];

  return entries.map((current) => (current.id === entry.id ? entry : current));
}
