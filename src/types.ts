export type CityOption = {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
};

export type SearchBarProps = {
  onSearchChange: (city: CityOption | null) => void;
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

