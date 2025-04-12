import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/MainDashboard/Sidebar";
import MapComponent from "./components/MainDashboard/MapComponent";
import Home from "./components/Homepage/Home";
import SeeResult from "./components/popups/SeeResult";
import ResultPopup from "./components/popups/ResultPopup";
import "./index.css";
import ChatbotPopup from "./components/popups/ChatbotPopup0";

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("Streets");
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [showSeeResult, setShowSeeResult] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showChatbotPopup, setShowChatbotPopup] = useState(false);
  
  // Create a function to handle the locate action
  const handleLocate = () => {
    setLocateTrigger(prev => prev + 1);
    setShowSeeResult(true);
  };

  // Expose the handleLocate function to the window object
  useEffect(() => {
    window.triggerLocateFunction = handleLocate;
    
    // Clean up when component unmounts
    return () => {
      delete window.triggerLocateFunction;
    };
  }, []);

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
          } 
        />
      </Routes>
    </Router>
  );  
}

export default App;