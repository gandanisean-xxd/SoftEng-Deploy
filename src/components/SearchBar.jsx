import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      const { lat, lon } = data[0];
      onSearch([parseFloat(lat), parseFloat(lon)]);
    } else {
      alert("Location not found!");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        background: "#fff",
        padding: "5px 10px",
        borderRadius: "20px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
    >
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          padding: "8px",
          fontSize: "14px",
          width: "250px",
        }}
      />
      <button
        type="submit"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          color: "#41AB5D",
        }}
      >
        🔍
      </button>
    </form>
  );
};

export default SearchBar;
