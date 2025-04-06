import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MapComponent from "./components/MapComponent";
import Home from "./components/Home";
import SeeResult from "./components/popups/SeeResult";
import ResultPopup from "./components/popups/ResultPopup";
import "./index.css";

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("Streets");
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [showSeeResult, setShowSeeResult] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showChatbotPopup, setShowChatbotPopup] = useState(false);

  const handleLocate = () => {
    setLocateTrigger(prev => prev + 1);
    setShowSeeResult(true);
  };

  const handleSearch = (location) => {
    setSearchLocation(location);
  };

  const handleClearSearch = () => {
    setSearchLocation(null);
  };

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const handleBasemapChange = (basemap) => {
    setSelectedBasemap(basemap);
  };

  const handleViewResult = () => {
    setShowSeeResult(false);
    setShowResultPopup(true);
  };

  // New handler for chatbot button
  const handleChatbotButton = () => {
    setShowResultPopup(false);
    setShowChatbotPopup(true);
    setShowSeeResult(false); // Ensure SeeResult is closed
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
                onLocate={handleLocate}
                onClearSearch={handleClearSearch}
                updateSidebarState={setIsSidebarCollapsed}
                onBasemapChange={handleBasemapChange}
                selectedBasemap={selectedBasemap}
              />
              <div className="main-content">
                <MapComponent 
                  searchLocation={searchLocation} 
                  isSidebarCollapsed={isSidebarCollapsed}
                  selectedBasemap={selectedBasemap}
                  onLocate={locateTrigger}
                />
              </div>

              {showSeeResult && (
                <SeeResult 
                  onClose={() => setShowSeeResult(false)}
                  onViewResult={handleViewResult}
                />
              )}

              {showResultPopup && (
                <ResultPopup 
                  onClose={() => setShowResultPopup(false)}
                  showChatbotPopup={showChatbotPopup}
                  setShowChatbotPopup={handleChatbotButton} // Use the new handler
                  setShowResultPopup={setShowResultPopup}
                />
              )}
            </div>
          } 
        />
      </Routes>
    </Router>
  );  
}

export default App;