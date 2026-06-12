import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { searchCities } from "../api";
import type { CityOption, SearchBarProps } from "../types";

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isDisabled }) => {
  const [search, setSearch] = useState<CityOption | null>(null);
  const [error, setError] = useState("");

  const loadOptions = async (inputValue: string) => {
    if (inputValue.trim().length < 2) {
      return { options: [] };
    }

    try {
      const cities = await searchCities(inputValue);
      const options: CityOption[] = cities.map((city) => ({
        value: `${city.latitude} ${city.longitude}`,
        label: `${city.name}, ${city.countryCode}`,
        latitude: city.latitude,
        longitude: city.longitude,
      }));

      setError("");
      return { options };
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not search for cities."
      );
      return { options: [] };
    }
  };

  const handleOnChange = (selectedOption: CityOption | null) => {
    setSearch(selectedOption);
    void onSearch(selectedOption);
  };

  return (
    <div>
      <label htmlFor="city-search" className="visually-hidden">
        Search for a city
      </label>
      <AsyncPaginate
        inputId="city-search"
        placeholder="Search for city"
        debounceTimeout={800}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
        isDisabled={isDisabled}
        noOptionsMessage={({ inputValue }) =>
          inputValue.trim().length < 2
            ? "Type at least two characters"
            : "No cities found"
        }
      />
      {error && (
        <p className="text-danger small mt-2 mb-0" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchBar;
