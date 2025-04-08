import React, { useState } from "react";
import "./Sidebar.css";

const SearchBar = ({ 
  onSearch,  // Just focuses map on coordinates
  onClearSearch, 
  isCollapsed 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}` +
        `&countrycodes=ph` +
        `&viewbox=116.95,4.6,126.6,18.2` +
        `&bounded=1`
      );
      
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        onSearch([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Location not found in the Philippines. Please try another search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    onClearSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <li className="search-bar-container" data-tooltip="Search Location">
      <img src="/icons/searchicon.png" alt="Search" className="search-icon" />
      {!isCollapsed && (
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search any Philippine location"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSearching}
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={handleClear}
              className="clear-button"
              aria-label="Clear search"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="search-spinner"></div>
              ) : (
                <img src="/icons/clear.png" alt="" className="clear-icon" />
              )}
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default SearchBar;