import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import { fetchWeather } from "../api";
import type { CityOption, WeatherEntry } from "../types";
import {
  FAVORITES_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  mergeEntries,
  readEntries,
  upsertEntry,
  writeEntries,
} from "../utils/storage";
import { getGeolocationErrorMessage } from "../utils/geolocation";
import { getLocationId } from "../utils/weather";

function loadInitialEntries(): WeatherEntry[] {
  return mergeEntries(
    readEntries(sessionStorage, SESSION_STORAGE_KEY),
    readEntries(localStorage, FAVORITES_STORAGE_KEY)
  );
}

const HomePage = () => {
  const [weatherEntries, setWeatherEntries] =
    useState<WeatherEntry[]>(loadInitialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    writeEntries(sessionStorage, SESSION_STORAGE_KEY, weatherEntries);
    writeEntries(
      localStorage,
      FAVORITES_STORAGE_KEY,
      weatherEntries.filter((entry) => entry.isFavorite)
    );
  }, [weatherEntries]);

  const toggleFavorite = (id: string) => {
    setWeatherEntries((entries) =>
      entries.map((entry) =>
        entry.id === id
          ? { ...entry, isFavorite: !entry.isFavorite }
          : entry
      )
    );
  };

  const handleRemove = (id: string) => {
    setWeatherEntries((entries) =>
      entries.filter((entry) => entry.id !== id)
    );
  };

  const loadWeather = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError("");

    try {
      const { current, forecast } = await fetchWeather(latitude, longitude);
      const newEntry: WeatherEntry = {
        id: getLocationId(latitude, longitude),
        weatherData: current,
        forecastData: forecast,
        isFavorite: false,
      };

      setWeatherEntries((entries) => upsertEntry(entries, newEntry));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load weather information."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (city: CityOption | null) => {
    if (!city) return;
    await loadWeather(city.latitude, city.longitude);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if (!window.isSecureContext) {
      setError(
        "Location access requires HTTPS. Open the deployed app over HTTPS or use localhost."
      );
      return;
    }

    setIsLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await loadWeather(coords.latitude, coords.longitude);
        } finally {
          setIsLocating(false);
        }
      },
      (geolocationError) => {
        setError(getGeolocationErrorMessage(geolocationError));
        setIsLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 15_000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  };

  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">
      <Navbar
        onUseGeolocation={handleGeolocation}
        isLocating={isLocating}
      />

      <div className="p-4 bg-secondary">
        <SearchBar onSearch={handleSearch} isDisabled={isLoading} />
      </div>

      <main className="flex-grow-1 bg-secondary pb-4">
        <div className="container" aria-live="polite">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-center text-dark py-3" role="status">
              <span className="spinner-border spinner-border-sm me-2" />
              Loading weather...
            </div>
          )}

          {weatherEntries.length === 0 && !isLoading ? (
            <p className="fs-4 text-center text-dark py-3">
              Select a city to see the weather.
            </p>
          ) : (
            <div className="row g-3">
              {weatherEntries.map((entry) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-4"
                  key={entry.id}
                >
                  <WeatherCard
                    data={entry.weatherData}
                    forecast={entry.forecastData}
                    onRemove={() => handleRemove(entry.id)}
                    onToggleFavorite={() => toggleFavorite(entry.id)}
                    isFavorite={entry.isFavorite}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
