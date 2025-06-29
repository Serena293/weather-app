import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/Searchbar";
import WeatherCard from "../components/WeatherCard";
import type { CityOption } from "../types";
import { WEATHER_API_URL, FORECAST_URL, WEATHER_API_KEY } from "../api";

const HomePage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

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

      setWeatherData(currentRes.data);

      const forecastRes = await axios.get(FORECAST_URL, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: "metric",
          lang: "en",
        },
      });

      setForecastData(forecastRes.data);
    } catch (error) {
      console.error("Errore nella fetch del meteo o delle previsioni:", error);
    }
  };

  return (
    <>
      <div className="app-wrapper d-flex flex-column min-vh-100">
        <Navbar />
        <div className="my-2 p-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <main className="flex-grow-1 d-flex justify-content-center align-items-center">
          {!weatherData ? (
            <p className="fs-4 text-secondary">
              Select a city to see the weather 🌤️
            </p>
          ) : (
            <WeatherCard data={weatherData} forecast={forecastData} />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
