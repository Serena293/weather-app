import type { AxiosRequestConfig } from "axios";


export const geoApiOptions: AxiosRequestConfig = {
  method: 'GET',
  url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
  
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
  }
};

export const GEO_API_URL ='https://wft-geo-db.p.rapidapi.com/v1/geo'

export const WEATHER_API_URL="https://api.openweathermap.org/data/2.5/weather"

export const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
