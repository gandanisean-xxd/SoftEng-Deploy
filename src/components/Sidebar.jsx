import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import ChatbotPopup from "./popups/chatbotpopup";
import ProfilePopup from "./popups/ProfilePopup";
import ResultPopup from "./popups/ResultPopup";
import SubmissionHistoryPopup from "./popups/SubmissionHistoryPopup";

const Sidebar = ({ 
  onSearch, 
  onLocate, 
  onClearSearch, 
  updateSidebarState,
  onBasemapChange,       // New prop for basemap updates
  selectedBasemap        // New prop for current basemap
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showReferenceMapDropdown, setShowReferenceMapDropdown] = useState(false);
  const [showHazardsDropdown, setShowHazardsDropdown] = useState(false);
  const [selectedHazards, setSelectedHazards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSubmissionHistoryPopup, setShowSubmissionHistoryPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showChatbotPopup, setShowChatbotPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("myProfile");

  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
    setShowProfileDropdown(false);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    updateSidebarState(!isCollapsed);
  };

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const toggleReferenceMapDropdown = () => {
    setShowReferenceMapDropdown(!showReferenceMapDropdown);
    setShowHazardsDropdown(false);
  };

  // Modified reference map handler
  const handleReferenceMapSelect = (option) => {
    onBasemapChange(option); // Notify parent component
    setShowReferenceMapDropdown(true);
  };

  const toggleHazardsDropdown = () => {
    setShowHazardsDropdown(!showHazardsDropdown);
    setShowReferenceMapDropdown(false);
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

   // DropdownArrow component for reusability
   const DropdownArrow = ({ isOpen }) => (
    <img 
      src="/icons/expand.png" 
      alt="Expand" 
      className={`dropdown-arrow ${isOpen ? "rotate" : ""}`}
    />
  );

  return (
    <div className={`app ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src="logo.png" alt="Logo" className="logo" />
        </div>
        <ul>
          {/* Location Tools Section */}
          {!isCollapsed && <h3 className="sidebar-section-label">LOCATION TOOLS</h3>}

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
                    ✕
                  </button>
                )}
              </div>
            )}
          </li>

          {/* Current Location */}
          <li onClick={onLocate}>
            <img src="/icons/currentloc.png" alt="Location" />
            {!isCollapsed && <span>Current Location</span>}
          </li>

          {/* Display Options Section */}
          {!isCollapsed && <h3 className="sidebar-section-label">DISPLAY OPTIONS</h3>}

           {/* Updated Reference Map Dropdown */}
           <li className="dropdown-item" onClick={toggleReferenceMapDropdown}>
            <img src="/icons/basemap.png" alt="Map" />
            {!isCollapsed && <span>Basemaps</span>}
            {!isCollapsed && <DropdownArrow isOpen={showReferenceMapDropdown} />}
          </li>
          {showReferenceMapDropdown && !isCollapsed && (
            <ul className="dropdown">
              {["Streets", "Satellite Imagery", "Terrain"].map((option) => (
                <li 
                  key={option} 
                  onClick={() => handleReferenceMapSelect(option)}
                  className={selectedBasemap === option ? "selected" : ""}
                >
                  <div className="selection-circle">
                    {selectedBasemap === option && <div className="selected-circle" />}
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
            {!isCollapsed && <DropdownArrow isOpen={showHazardsDropdown} />}
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

          {/* Useful Links Section */}
          {!isCollapsed && <h3 className="sidebar-section-label">USEFUL LINKS</h3>}

          {/* Useful Links */}
          <li>
            <img src="/icons/pagasa.png" alt="PAGASA" />
            {!isCollapsed && <span>PAGASA</span>}
          </li>
          <li>
            <img src="/icons/denr.png" alt="DENR" />
            {!isCollapsed && <span>DENR</span>}
          </li>
          <li>
            <img src="/icons/nasa.png" alt="NASA" />
            {!isCollapsed && <span>NASA</span>}
          </li>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme}>
            <img src={isDarkTheme ? "light-icon.png" : "dark-icon.png"} alt="Theme Toggle" />
          </button>
        </ul>
      </div>

      {/* Top Bar */}
      <div className={`top-bar ${isCollapsed ? "collapsed" : ""}`}>
        <button className="menu-button" onClick={toggleSidebar}>
          <img src="/icons/menu.png" alt="Menu" />
        </button>

        {/* Home button with navigation */}
        <button className="home-button" onClick={handleHomeClick}>
          <img src="/icons/home.png" alt="Home" />
          <span>Home</span>
        </button>

        <div className="top-bar-right">
          <button className="result-button" onClick={() => setShowResultPopup(true)}>
            <img src="/icons/result.png" alt="Result" />
            <span>Result</span>
          </button>
          <button className="profile-button" onClick={toggleProfileDropdown}>
            <img src="/icons/profile.png" alt="Profile" />
            <span>Profile</span>
            <DropdownArrow isOpen={showProfileDropdown} />
          </button>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => setShowSubmissionHistoryPopup(true)}>
                <img src="/icons/history.png" alt="Submission History" />
                <span>Submission History</span>
              </div>            
              <div className="dropdown-item" onClick={toggleProfilePopup}>
                <img src="/icons/profile.png" alt="Profile" />
                <span>Profile</span>
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <img src="/icons/logout.png" alt="Logout" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup Components */}
      {showSubmissionHistoryPopup && (
        <SubmissionHistoryPopup
          onClose={() => setShowSubmissionHistoryPopup(false)}
          showProfilePopup={showProfilePopup}
          setShowProfilePopup={setShowProfilePopup}
          setShowSubmissionHistoryPopup={setShowSubmissionHistoryPopup}
        />
      )}

      {showProfilePopup && (
        <ProfilePopup
          onClose={() => setShowProfilePopup(false)}
          showSubmissionHistoryPopup={showSubmissionHistoryPopup}
          setShowSubmissionHistoryPopup={setShowSubmissionHistoryPopup}
          setShowProfilePopup={setShowProfilePopup}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {showResultPopup && (
        <ResultPopup
          onClose={() => setShowResultPopup(false)}
          showChatbotPopup={showChatbotPopup}
          setShowChatbotPopup={setShowChatbotPopup}
          setShowResultPopup={setShowResultPopup}
        />
      )}

      {showChatbotPopup && (
        <ChatbotPopup
          onClose={() => setShowChatbotPopup(false)}
          showResultPopup={showResultPopup}
          setShowResultPopup={setShowResultPopup}
          setShowChatbotPopup={setShowChatbotPopup}
        />
      )}
    </div>
  );
};

export default Sidebar;