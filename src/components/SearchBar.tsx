import React, { useState } from 'react';

type SearchBarProps = {
  onSearch: (city: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput(""); 
    }
  };

  return (
    <div className="d-flex justify-content-center my-4">
      <form 
        onSubmit={handleSubmit} 
        className="d-flex w-100" 
        style={{ maxWidth: '400px' }}
      >
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Search city"
        />
        <button type="submit" className="btn btn-dark">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
