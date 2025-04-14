import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import "./Homec.css";

const Home = () => {
  const [showLoginRegister, setShowLoginRegister] = useState(false);
  const [headerScrolled,] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  // Refs for scrolling to sections
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const viewportMiddle = scrollPosition + (windowHeight / 2);
    
    // Get the positions of each section
    if (aboutRef.current && featuresRef.current && contactRef.current) {
      const aboutPosition = aboutRef.current.getBoundingClientRect().top + scrollPosition;
      const featuresPosition = featuresRef.current.getBoundingClientRect().top + scrollPosition;
      const contactPosition = contactRef.current.getBoundingClientRect().top + scrollPosition;
      
      // Determine the visible section based on their actual positions
      const aboutHeight = aboutRef.current.offsetHeight;
      const featuresHeight = featuresRef.current.offsetHeight;
      const contactHeight = contactRef.current.offsetHeight;
      
      // Check which section contains the middle of the viewport
      if (viewportMiddle >= contactPosition && viewportMiddle <= contactPosition + contactHeight) {
        setActiveSection('contact');
      } else if (viewportMiddle >= featuresPosition && viewportMiddle <= featuresPosition + featuresHeight) {
        setActiveSection('features');
      } else if (viewportMiddle >= aboutPosition && viewportMiddle <= aboutPosition + aboutHeight) {
        setActiveSection('about');
      }
    }
  };
  
  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToSection = (ref, section) => {
    setActiveSection(section);
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setShowLoginRegister(true);
  };

  const handleCloseModal = () => {
    setShowLoginRegister(false);
  };
  
  const handleLocationClick = () => {
    navigate('/map');
    setTimeout(() => {
      if (window.triggerLocateFunction) {
        window.triggerLocateFunction();
      }
    }, 500);
  };


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
        // Navigate to map page
        navigate('/map');
        
        // Allow time for the map component to load before triggering the search
        setTimeout(() => {
          if (window.searchLocationFunction) {
            window.searchLocationFunction([parseFloat(lat), parseFloat(lon)]);
          }
        }, 500);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Feature data for mapping - changed emoji icons to image paths
  const features = [
    {
      title: "Interactive GIS Map",
      description: "Real-time geospatial data",
      icon: "/icons/interactive.png"
    },
    {
      title: "AI Analysis Tools",
      description: "Pattern detection & prediction",
      icon: "/icons/aianalysis.png"
    },
    {
      title: "Environmental Layers",
      description: "Rainfall, temp, elevation",
      icon: "/icons/environmentlayers.png"
    },
    {
      title: "Reporting Tool",
      description: "Auto-generate insights",
      icon: "/icons/reportingtool.png"
    },
    {
      title: "Location-Based Search",
      description: "Find areas by name or GPS",
      icon: "/icons/locationbased.png"
    },
    {
      title: "Green Space Identification",
      description: "Detect green zones via AI",
      icon: "/icons/greenspace.png"
    },
  ];

  // Form state for contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
  
  return (
    <div className="home-container">
      {/* Header Section - Updated with navigation */}
      <header className={`home-header ${headerScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="home-logo-container">
            <img src="/icons/logo.png" alt="Logo" className="home-logo" />
            <div className="home-title-container">
              <h1 className="home-main-title">AI-Driven GIS</h1>
              <p className="home-subtitle">Shaping Sustainable Urban Landscapes</p>
            </div>
          </div>
          
          <div className="header-navigation">
            <button 
              onClick={() => scrollToSection(aboutRef, 'about')} 
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection(featuresRef, 'features')} 
              className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection(contactRef, 'contact')} 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Contact
            </button>
            <button className="home-login-button" onClick={handleLoginClick}>
              <img src="/icons/login.png" alt="Login" className="home-login-icon" />
              Login
            </button>
          </div>
        </div>
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
              <img src="/icons/homepageebg.avif" alt="Background" className="hero-image" />
              <div className="overlay">
              <div className="side-search-container">
            <div className="side-search-wrapper">
              <input 
                type="text" 
                placeholder="Type a location" 
                className="side-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <button 
                className="side-search-button"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="search-spinner"></div>
                ) : (
                  <img src="/icons/search.png" alt="Search" />
                )}
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

      {/* Footer Section with scroll-to functionality */}
      <footer className="footer">
        <div className="partners">
          <div className="partner">
            <a className="partner-link">
              <img src="icons/qcu.webp" alt="DOST" className="partner-logo" />
            </a>
            <p className="partner-text">QCU</p>
          </div>
          <div className="partner">
            <a className="partner-link">
              <img src="icons/pagasa.png" alt="DOST-PAGASA" className="partner-logo" />
            </a>
            <p className="partner-text">DOST-PAGASA</p>
          </div>
        </div>
      </footer>

      {/* About Section */}
      <div ref={aboutRef} className="about-section">
        <div className="about-content-container">
          {/* About Us - Full width */}
          <div className="about-us-card">
            <h2 className="section-title">ABOUT</h2>
            <div className="section-content">
              <p>AI-Driven GIS for Green Infrastructure is an intelligent mapping platform designed to support climate-resilient urban planning. It leverages geospatial data and artificial intelligence to identify, recommend, and optimize green spaces in cities.</p>
            </div>
          </div>

          {/* Three column layout below */}
          <div className="about-cards-grid">
            <div className="about-card"> {/* Changed from feature-card to about-card */}
              <h3 className="about-card-title">Our Mission</h3> {/* Changed classname */}
              <p className="about-card-content">To empower city planners, researchers, and decision-makers with cutting-edge tools that promote sustainable, eco-friendly, and climate-resilient urban development.</p> {/* Changed classname */}
            </div>

            <div className="about-card">
              <h3 className="about-card-title">Why It Matters</h3>
              <p className="about-card-content">Urban areas face growing challenges due to climate change, poor planning, and limited green spaces. Green infrastructure improves air quality, reduces heat, and supports biodiversity. Our AI + GIS system helps identify where these improvements are most needed — fast, accurately, and at scale.</p>
            </div>

            <div className="about-card">
              <h3 className="about-card-title">Who Can Use It?</h3>
              <p className="about-card-content">Local Government Units – for city planning and zoning Researchers & Environmentalists – for spatial analysis and sustainability research Urban Planners & Architects – for integrating green elements in their designs</p>
            </div>
          </div>
        </div>


        {/* Features section */}
        <div ref={featuresRef} className="features-section">
          <div className="features-container">
            <h2 className="features-title">FEATURES</h2>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <h3 className="feature-title">{feature.title}</h3>
                  <div className="feature-icon-container">
                    <img src={feature.icon} alt={feature.title} className="feature-icon-img" />
                  </div>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div ref={contactRef} className="contact-section">
          <h2 className="contact-title">CONTACT</h2>

          <p className="contact-intro">
            Get in touch with us. Fill out the form with your details for comments, feedback, and inquiries.
          </p>

          <div className="contact-container">
            {/* Contact form */}
            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name<span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email<span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location<span className="required">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message <span className="optional">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                  />
                </div>

                <div className="form-submit">
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </form>
            </div>

            {/* Contact info */}
            <div className="contact-info">
              <div className="contact-details">
                <h3 className="contact-info-title">Get in Touch</h3>
                
                <div className="contact-item">
                  <span className="contact-item-icon">
                    <img src="/icons/phone.png" alt="Logo" className="phone-icon" />
                  </span>
                  <p className="contact-item-text">123-456-789</p>
                </div>
                
                <div className="contact-item">
                  <span className="contact-item-icon">
                    <img src="/icons/mail.png" alt="Email" className="email-icon" />
                  </span>
                  <p className="contact-item-text">ai-gis-support@gmail.com</p>
                </div>

                <div className="contact-item">
                  <span className="contact-item-icon">
                    <img src="/icons/@icon.png" alt="Phone" className="address-icon" />
                  </span>
                  <p className="contact-item-text">
                    Quezon City University, Novaliches, QC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default Home;