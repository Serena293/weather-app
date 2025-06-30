import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/Searchbar";
import WeatherCard from "../components/WeatherCard";
import type { CityOption } from "../types";
import { WEATHER_API_URL, FORECAST_URL, WEATHER_API_KEY } from "../api";
import type { WeatherData, ForecastData, WeatherEntry } from "../types";

const HomePage = () => {
  const [weatherEntries, setWeatherEntries] = useState<WeatherEntry[]>(() => {
    const stored = sessionStorage.getItem("weatherEntries");
    if (stored) {
      try {
        const parsed: WeatherEntry[] = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Errore nel parsing di sessionStorage:", e);
      }
    }
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem("weatherEntries", JSON.stringify(weatherEntries));
  }, [weatherEntries]);
  useEffect(() => {
    const session = sessionStorage.getItem("weatherEntries");
    const local = localStorage.getItem("favorites");

    const sessionData: WeatherEntry[] = session ? JSON.parse(session) : [];
    const favoriteData: WeatherEntry[] = local ? JSON.parse(local) : [];

    const merged = [...sessionData];

    favoriteData.forEach((fav) => {
      if (!merged.some((entry) => entry.id === fav.id)) {
        merged.push(fav);
      }
    });

    setWeatherEntries(merged);
  }, []);

  const toggleFavorite = (id: number) => {
    setWeatherEntries((prevEntries) => {
      const updatedEntries = prevEntries.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      );
      const favorites = updatedEntries.filter((entry) => entry.isFavorite);
      localStorage.setItem("favorites", JSON.stringify(favorites));

      return updatedEntries;
    });
  };

  const handleRemove = (id: number) => {
    setWeatherEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleSearch = async (city: CityOption | null) => {
    if (!city) return;
    const [lat, lon] = city.value.split(" ");

    try {
      const currentRes = await axios.get(WEATHER_API_URL, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: "metric",
          lang: "en",
        },
      });

      const forecastRes = await axios.get(FORECAST_URL, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: "metric",
          lang: "en",
        },
      });

      const newEntry: WeatherEntry = {
        id: Date.now(),
        weatherData: currentRes.data,
        forecastData: forecastRes.data,
      };

      setWeatherEntries((prev) => [...prev, newEntry]);
    } catch (error) {
      console.error("Errore nella fetch del meteo o delle previsioni:", error);
    }
  };

  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">
      <Navbar />
      <div className="my-2 p-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <main className="flex-grow-1 d-flex flex-wrap justify-content-center align-items-start gap-4 p-4">
        {weatherEntries.length === 0 ? (
          <p className="fs-4 text-secondary text-center">
            Select a city to see the weather 🌤️
          </p>
        ) : (
          weatherEntries.map((entry) => (
            <WeatherCard
              key={`${entry.id}`}
              data={entry.weatherData}
              forecast={entry.forecastData}
              onRemove={() => handleRemove(entry.id)}
              onToggleFavorite={() => toggleFavorite(entry.id)}
              isFavorite={entry.isFavorite}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
