export type CityOption = {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
};

export type SearchBarProps = {
  onSearch: (city: CityOption | null) => void;
};

export type GeoCity = {
  id: number;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure:number
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

export interface WeatherEntry {
    id: number;
  weatherData: WeatherData;
  forecastData: ForecastData;
  isFavorite?: boolean;
}


export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
  };
}

 export interface WeatherCardProps {
  data: WeatherData | null;
  forecast: ForecastData | null;
  onRemove?: () => void;
  onToggleFavorite: () => void;
  isFavorite?: boolean;
}


export type NavbarProps = {
  onUseGeolocation: () => void;
};