import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import MapComponent from "./components/mapcomponent";
import Home from "./components/Home";
import "./index.css";

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleSearch = (location) => {
    setSearchLocation(location);
  };

  const handleClearSearch = () => {
    setSearchLocation(null);
  };

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home showLoginPopup={showLoginPopup} toggleLoginPopup={toggleLoginPopup} />} />
        <Route 
          path="/map" 
          element={
            <div className={`app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
              <Sidebar
                onSearch={handleSearch}
                onLocate={handleClearSearch}
                onClearSearch={handleClearSearch}
                updateSidebarState={setIsSidebarCollapsed}
              />
              <div className="main-content">
                <MapComponent searchLocation={searchLocation} isSidebarCollapsed={isSidebarCollapsed} />
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );  
}

export default App;