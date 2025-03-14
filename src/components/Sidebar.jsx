import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Sidebar.css";
import L from "leaflet";

const Sidebar = ({ onSearch, onLocate, onClearSearch, updateSidebarState }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showReferenceMapDropdown, setShowReferenceMapDropdown] = useState(false);
  const [showHazardsDropdown, setShowHazardsDropdown] = useState(false);
  const [selectedReferenceMap, setSelectedReferenceMap] = useState(null);
  const [selectedHazards, setSelectedHazards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  // Handle Home button click
  const handleHomeClick = () => {
    console.log("Home button clicked"); // Debugging line
    navigate("/"); // Navigate to the home page
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    updateSidebarState(!isCollapsed);
  };

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const toggleReferenceMapDropdown = () => {
    setShowReferenceMapDropdown(!showReferenceMapDropdown);
    setShowHazardsDropdown(false);
  };

  const toggleHazardsDropdown = () => {
    setShowHazardsDropdown(!showHazardsDropdown);
    setShowReferenceMapDropdown(false);
  };

  const handleReferenceMapSelect = (option) => {
    setSelectedReferenceMap(option);
  };

  const handleHazardSelect = (hazard) => {
    setSelectedHazards((prevSelected) =>
      prevSelected.includes(hazard) ? prevSelected.filter((h) => h !== hazard) : [...prevSelected, hazard]
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    const mockGeocoding = (query) => {
      const locations = {
        "manila": [14.5995, 120.9842],
        "cebu": [10.3157, 123.8854],
        "davao": [7.1907, 125.4553],
        "baguio": [16.4023, 120.5960],
        "palawan": [9.8349, 118.7384],
        "quezon city": [14.6760, 121.0437],
        "cagayan de oro": [8.4542, 124.6319],
        "iloilo": [10.7202, 122.5621],
        "zamboanga": [6.9214, 122.0790],
        "bohol": [9.8499, 124.1435],
      };

      return locations[query.trim().toLowerCase()] || null;
    };

    const location = mockGeocoding(searchQuery);
    if (location) {
      onSearch(location);
    } else {
      alert("Location not found. Please try another search.");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onClearSearch();
  };

  useEffect(() => {
    const zoomControls = document.querySelector(".leaflet-control-zoom");
    if (zoomControls) {
      zoomControls.style.left = isCollapsed ? "90px" : "270px";
    }
  }, [isCollapsed]);

  return (
    <div className={`app ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src="logo.png" alt="Logo" className="logo" />
        </div>
        <ul>
          {/* Search Bar */}
          <li className="search-bar-container">
            <img src="/icons/searchicon.png" alt="Search" className="search-icon" />
            {!isCollapsed && (
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search Location"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                {searchQuery && (
                  <button className="clear-button" onClick={handleClearSearch}>
                    ×
                  </button>
                )}
              </div>
            )}
          </li>

          <li onClick={onLocate}>
            <img src="/icons/currentloc.png" alt="Location" />
            {!isCollapsed && <span>Current Location</span>}
          </li>

          {/* Reference Map Dropdown */}
          <li className="dropdown-item" onClick={toggleReferenceMapDropdown}>
            <img src="/icons/basemap.png" alt="Map" />
            {!isCollapsed && <span>Basemaps</span>}
            {!isCollapsed && <span className={`dropdown-arrow ${showReferenceMapDropdown ? "open" : ""}`}>&#9662;</span>}
          </li>
          {showReferenceMapDropdown && !isCollapsed && (
            <ul className="dropdown">
              {["Satellite Imagery (Google)", "Streets (OpenStreetMaps)", "Terrain", "Another Option"].map((option) => (
                <li key={option} onClick={() => handleReferenceMapSelect(option)}>
                  <div className="selection-circle">
                    {selectedReferenceMap === option && <div className="selected-circle" />}
                  </div>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Hazards Dropdown */}
          <li className="dropdown-item" onClick={toggleHazardsDropdown}>
            <img src="/icons/hazard.png" alt="Hazards" />
            {!isCollapsed && <span>Hazards</span>}
            {!isCollapsed && <span className={`dropdown-arrow ${showHazardsDropdown ? "open" : ""}`}>&#9662;</span>}
          </li>
          {showHazardsDropdown && !isCollapsed && (
            <ul className="dropdown">
              {[
                { name: "Flooding", icon: "/icons/flood.png" },
                { name: "Rainfall", icon: "/icons/rainfall.png" },
                { name: "Heat Index", icon: "/icons/heat.png" },
              ].map((hazard) => (
                <li key={hazard.name}>
                  <input
                    type="checkbox"
                    checked={selectedHazards.includes(hazard.name)}
                    onChange={() => handleHazardSelect(hazard.name)}
                  />
                  <img src={hazard.icon} alt={hazard.name} className="hazard-icon" />
                  <span>{hazard.name}</span>
                </li>
              ))}
            </ul>
          )}

          <button className="theme-toggle" onClick={toggleTheme}>
            <img src={isDarkTheme ? "light-icon.png" : "dark-icon.png"} alt="Theme Toggle" />
          </button>
        </ul>
      </div>

      {/* Top Bar */}
      <div className={`top-bar ${isCollapsed ? "collapsed" : ""}`}>
        <button className="menu-button" onClick={toggleSidebar}>
          <img src="/icons/menu.png" alt="Menu" />
          <span>Menu</span>
        </button>

        {/* Home button with navigation */}
        <button className="home-button" onClick={handleHomeClick}>
          <img src="/icons/home.png" alt="Home" />
          <span>Home</span>
        </button>

        <div className="top-bar-right">
          <button className="result-button">
            <img src="/icons/result.png" alt="Result" />
            <span>Result</span>
          </button>
          <button className="profile-button">
            <img src="/icons/profile.png" alt="Profile" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;