import type { ForecastData, ForecastItem } from "../types";

export type DailyForecast = {
  date: string;
  icon: string;
  description: string;
  temp: number;
};

export function getLocationId(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

export function formatWindSpeed(metersPerSecond: number): string {
  return `${Math.round(metersPerSecond * 3.6)} km/h`;
}

function getCityDate(unixSeconds: number, timezoneOffset: number): Date {
  return new Date((unixSeconds + timezoneOffset) * 1000);
}

export function getCityDateKey(
  unixSeconds: number,
  timezoneOffset: number
): string {
  return getCityDate(unixSeconds, timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

export function formatCityHour(
  unixSeconds: number,
  timezoneOffset: number
): string {
  const hours = getCityDate(unixSeconds, timezoneOffset).getUTCHours();
  return `${String(hours).padStart(2, "0")}:00`;
}

export function getDayName(dateKey: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(`${dateKey}T12:00:00Z`));
}

export function getForecastDisplay(
  forecast: ForecastData,
  nowMs = Date.now()
): {
  todayForecast: ForecastItem[];
  dailyForecasts: DailyForecast[];
} {
  const timezoneOffset = forecast.city.timezone;
  const todayKey = getCityDateKey(Math.floor(nowMs / 1000), timezoneOffset);

  const todayForecast = forecast.list
    .filter(
      (item) => getCityDateKey(item.dt, timezoneOffset) === todayKey
    )
    .sort((a, b) => a.dt - b.dt);

  const closestToNoon = new Map<
    string,
    { item: ForecastItem; distance: number }
  >();

  forecast.list.forEach((item) => {
    const dateKey = getCityDateKey(item.dt, timezoneOffset);
    if (dateKey <= todayKey) return;

    const localHour = getCityDate(item.dt, timezoneOffset).getUTCHours();
    const distance = Math.abs(localHour - 12);
    const existing = closestToNoon.get(dateKey);

    if (!existing || distance < existing.distance) {
      closestToNoon.set(dateKey, { item, distance });
    }
  });

  const dailyForecasts = Array.from(closestToNoon.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(0, 5)
    .map(([date, { item }]) => ({
      date,
      icon: item.weather[0]?.icon || "unknown",
      description: item.weather[0]?.description || "Weather forecast",
      temp: Math.round(item.main.temp),
    }));

  return { todayForecast, dailyForecasts };
}
