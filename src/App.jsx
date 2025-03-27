import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MapComponent from "./components/MapComponent";
import Home from "./components/Home";
import "./index.css";

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("Streets"); // New state for basemap

  const handleSearch = (location) => {
    setSearchLocation(location);
  };

  const handleClearSearch = () => {
    setSearchLocation(null);
  };

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  // New handler for basemap changes
  const handleBasemapChange = (basemap) => {
    setSelectedBasemap(basemap);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              showLoginPopup={showLoginPopup} 
              toggleLoginPopup={toggleLoginPopup} 
            />
          } 
        />
        <Route 
          path="/map" 
          element={
            <div className={`app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
              <Sidebar
                onSearch={handleSearch}
                onLocate={handleClearSearch}
                onClearSearch={handleClearSearch}
                updateSidebarState={setIsSidebarCollapsed}
                onBasemapChange={handleBasemapChange}  // New prop
                selectedBasemap={selectedBasemap}      // New prop
              />
              <div className="main-content">
                <MapComponent 
                  searchLocation={searchLocation} 
                  isSidebarCollapsed={isSidebarCollapsed}
                  selectedBasemap={selectedBasemap}    // New prop
                />
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );  
}

export default App;