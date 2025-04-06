import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginRegister from "./LoginRegister"; // Import the Login/Register component
import "./Homec.css"; // Import the CSS file for Home page

const Home = () => {
  const [showLoginRegister, setShowLoginRegister] = useState(false); // State to control modal visibility
  const navigate = useNavigate(); // Hook for navigation
  const handleLoginClick = () => {
    setShowLoginRegister(true); // Show the Login/Register modal
  };

  const handleCloseModal = () => {
    setShowLoginRegister(false); // Hide the Login/Register modal
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo-container">
        <img src="/icons/logo.png" alt="Logo" className="logo" />
        <div className="title-container">
            <h1 className="title">AI-Driven GIS</h1>
            <p className="subtitle">Shaping Sustainable Urban Landscapes</p>
          </div>
        </div>
        <button className="login-button" onClick={handleLoginClick}>
        <img src="/icons/login.png" alt="Login" className="login-icon" />
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
    <div className="Hsearch-container">
      <div className="search-wrapper">
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
  </div>
</div>


      {/* Info Section */}
      <div className="info-section">
        <p>
          This platform utilizes AI-driven GIS for analysis and visualization. Data sources include government agencies, satellite imagery, and research institutions. Results are for informational purposes only.
        </p>
      </div>

{/* Footer Section */}
<footer className="footer">
  <div className="footer-buttons">
    <a href="/about" className="button">About</a>
    <a href="/features" className="button">Features</a>
    <a href="/contact" className="button">Contact</a>
  </div>
  <div className="partners">
    <div className="partner">
      <a href="https://www.dost.gov.ph" target="_blank" rel="noopener noreferrer">
        <img src="icons/dost.png" alt="DOST" />
        <p>DOST</p>
      </a>
    </div>
    <div className="partner">
      <a href="https://pcieerd.dost.gov.ph" target="_blank" rel="noopener noreferrer">
        <img src="icons/pcieerd.png" alt="DOST-PCIEERD" />
        <p>DOST-PCIEERD</p>
      </a>
    </div>
    <div className="partner">
      <a href="https://www.phivolcs.dost.gov.ph" target="_blank" rel="noopener noreferrer">
        <img src="icons/phivolcs.jpg" alt="DOST-PHIVOLCS" />
        <p>DOST-PHIVOLCS</p>
      </a>
    </div>
    <div className="partner">
      <a href="https://www.pagasa.dost.gov.ph" target="_blank" rel="noopener noreferrer">
        <img src="icons/pagasa.png" alt="DOST-PAGASA" />
        <p>DOST-PAGASA</p>
      </a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;
