import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiOptions } from "../api";
import type { CityOption, SearchBarProps, GeoCity } from "../types";
import axios from "axios";

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState<CityOption | null>(null);

  const loadOptions = async (inputValue: string) => {
    try {
      const response = await axios.request({
        ...geoApiOptions,
        params: {
          namePrefix: inputValue,
          minPopulation: 40000,
          sortDirectives: ["-population"],
        },
      });

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
    onSearch(selectedOption);
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
