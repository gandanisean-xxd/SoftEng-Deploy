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
          <img src="your-logo-image.png" alt="Logo" className="logo" />
          <div className="title-container">
            <h1 className="title">AI-Driven GIS</h1>
            <p className="subtitle">Shaping Sustainable Urban Landscapes</p>
          </div>
        </div>
        <button className="login-button" onClick={handleLoginClick}>
          <img src="your-login-icon.png" alt="Login" className="login-icon" />
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
            <input type="text" placeholder="Type a location" className="search-input" />
            <button className="search-button">
              <img src="your-search-icon.png" alt="Search" />
              Search
            </button>
          </div>
          <div className="buttons-container">
            <button className="location-button">
              <img src="your-location-icon.png" alt="Current Location" />
              Current Location
            </button>
            <button className="mapview-button" onClick={() => navigate("/map")}>
              <img src="your-mapview-icon.png" alt="Map View" />
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
          <button>About</button>
          <button>Features</button>
          <button>Contact</button>
        </div>
        <div className="partners">
          <img src="your-partner1-logo.png" alt="Partner 1" />
          <img src="your-partner2-logo.png" alt="Partner 2" />
          <img src="your-partner3-logo.png" alt="Partner 3" />
          <img src="your-partner4-logo.png" alt="Partner 4" />
        </div>
      </footer>
    </div>
  );
};

export default Home;
