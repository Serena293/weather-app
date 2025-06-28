import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../api";
import type { CityOption, SearchBarProps, GeoCity } from "../types";
import axios from "axios";

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const [search, setSearch] = useState<CityOption | null>(null);

  const loadOptions = async (inputValue: string) => {
    try {
      const response = await axios.request(
        {
          ...geoApiOptions,
          params: {
            namePrefix: inputValue,
          
          },
        }
      );

      const options = response.data.data.map((city: GeoCity) => ({
        value: `${city.latitude} ${city.longitude}`,
        label: `${city.name}, ${city.countryCode}`,
      }));

      return {
        options,
      };
    } catch (error) {
      console.error("Errore nella fetch delle città:", error);
      return { options: [] };
    }
  };

  const handleOnChange = (selectedOption: CityOption | null) => {
    setSearch(selectedOption);
    onSearchChange(selectedOption);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default SearchBar;
