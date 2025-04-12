import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import "./Homec.css";

const Home = () => {
  
  const [showLoginRegister, setShowLoginRegister] = useState(false); // State to control modal visibility
  const navigate = useNavigate(); // Hook for navigation
  
  const handleLoginClick = () => {
    setShowLoginRegister(true); // Show the Login/Register modal
  };

  const handleCloseModal = () => {
    setShowLoginRegister(false); // Hide the Login/Register modal
  };
  
  const handleLocationClick = () => {
    // Navigate to map view
    navigate('/map');
    
    // Trigger location function after navigation to ensure component mounts
    setTimeout(() => {
      // This will trigger the locate function in App.js which shows the SeeResult popup
      if (window.triggerLocateFunction) {
        window.triggerLocateFunction();
      }
    }, 500); // Increased timeout to ensure map component is fully mounted
  };

  return (
    <div className="home-container">
            {/* Header Section */}
            <header className="home-header">
              <div className="home-logo-container">
                <img src="/icons/logo.png" alt="Logo" className="home-logo" />
                <div className="home-title-container">
                  <h1 className="home-main-title">AI-Driven GIS</h1>
                  <p className="home-subtitle">Shaping Sustainable Urban Landscapes</p>
                </div>
              </div>
              <button className="home-login-button" onClick={handleLoginClick}>
                <img src="/icons/login.png" alt="Login" className="home-login-icon" />
                Login
              </button>
            </header>

            {/* Login/Register Modal */}
            {showLoginRegister && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <button className="close-button" onClick={handleCloseModal}>
                    &times;
                  </button>
                  <LoginRegister />
                </div>
              </div>
            )}
          
        {/* Hero Section */}
        <div className="hero-section">
          <img src="/icons/philippines.webp" alt="Background" className="hero-image" />
          <div className="overlay">
            <div className="search-container">
              <div className="search-row">
                <input type="text" placeholder="Type a location" className="search-input" />
                <button className="search-button">
                  <img src="/icons/search.png" alt="Search" />
                </button>
              </div>
            </div>

            <div className="buttons-container">
              <button 
                className="location-button"
                data-tooltip="Get your real-time location and navigate easily"
                onClick={handleLocationClick}
              >
                <img src="/icons/currentlocation1.png" alt="Current Location" />
                Current Location
              </button>
              <button 
                className="mapview-button" 
                onClick={() => navigate("/map")}
                data-tooltip="See More Features"
              >
                <img src="/icons/mapview.png" alt="Map View" />
                Go to Map View
              </button>
            </div>
            {/* Info Section */}
            <div className="info-section">
              <p>
                This platform utilizes AI-driven GIS for analysis and visualization. Data sources include government agencies, satellite imagery, and research institutions. Results are for informational purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="footer">
          <div className="partners">
            <div className="partner">
              <a href="https://www.dost.gov.ph" target="_blank" rel="noopener noreferrer" className="partner-link">
                <img src="icons/dost.png" alt="DOST" className="partner-logo" />
              </a>
              <p className="partner-text">DOST</p>
            </div>
            <div className="partner">
              <a href="https://pcieerd.dost.gov.ph" target="_blank" rel="noopener noreferrer" className="partner-link">
                <img src="icons/pcieerd.png" alt="DOST-PCIEERD" className="partner-logo" />
              </a>
              <p className="partner-text">DOST-PCIEERD</p>
            </div>
            <div className="partner">
              <a href="https://www.phivolcs.dost.gov.ph" target="_blank" rel="noopener noreferrer" className="partner-link">
                <img src="icons/phil.png" alt="DOST-PHIVOLCS" className="partner-logo" />
              </a>
              <p className="partner-text">DOST-PHIVOLCS</p>
            </div>
            <div className="partner">
              <a href="https://www.pagasa.dost.gov.ph" target="_blank" rel="noopener noreferrer" className="partner-link">
                <img src="icons/pagasa.png" alt="DOST-PAGASA" className="partner-logo" />
              </a>
              <p className="partner-text">DOST-PAGASA</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="/about" className="footer-link">About</a>
            <a href="/features" className="footer-link">Features</a>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
        </footer>
    </div>
  );
};

export default Home;