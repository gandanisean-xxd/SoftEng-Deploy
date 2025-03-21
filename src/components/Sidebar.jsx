import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onSearch, onLocate, onClearSearch, updateSidebarState }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showReferenceMapDropdown, setShowReferenceMapDropdown] = useState(false);
  const [showHazardsDropdown, setShowHazardsDropdown] = useState(false);
  const [selectedReferenceMap, setSelectedReferenceMap] = useState(null);
  const [selectedHazards, setSelectedHazards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // State for profile dropdown
  const [showProfilePopup, setShowProfilePopup] = useState(false); // State for profile pop-up
  const [showSubmissionHistoryPopup, setShowSubmissionHistoryPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showChatbotPopup, setShowChatbotPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("myProfile");
  


  const [messages, setMessages] = useState([
    { sender: "user", text: "Why is this place prone to flooding?" },
    {
      sender: "bot",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { sender: "user", text: newMessage }]);
    setNewMessage("");
  };
  


  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
    setShowProfileDropdown(false); // Close dropdown when pop-up is opened
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    navigate("/"); // Navigate to the home page
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
                    clear
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

          {/* Reference Map Dropdown */}
          <li className="dropdown-item" onClick={toggleReferenceMapDropdown}>
            <img src="/icons/basemap.png" alt="Map" />
            {!isCollapsed && <span>Basemaps</span>}
            {!isCollapsed && <span className={`dropdown-arrow ${showReferenceMapDropdown ? "open" : ""}`}>&#9662;</span>}
          </li>
          {showReferenceMapDropdown && !isCollapsed && (
            <ul className="dropdown">
              {["Satellite Imagery", "Streets", "Terrain"].map((option) => (
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

      
      
      {/* Submission History Pop-up */}
      {showSubmissionHistoryPopup && (
        <div className="profile-popup-overlay">
          <div className="profile-popup">
            {/* Panel */}
            <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
              <div className="panel-left">
                <button
                  className={showProfilePopup ? "active" : ""}
                  onClick={() => { setShowProfilePopup(true); setShowSubmissionHistoryPopup(false); }}
                >
                  <img
                    src={showProfilePopup ? "/icons/profile.png" : "/icons/greenprofile.png"}
                    alt="Profile"
                  />
                </button>
                <button
                  className={showSubmissionHistoryPopup ? "active" : ""}
                  onClick={() => { setShowSubmissionHistoryPopup(true); setShowProfilePopup(false); }}
                >
                  <img
                    src={showSubmissionHistoryPopup ? "/icons/result.png" : "/icons/greenresult.png"}
                    alt="Submission History"
                  />
                </button>
              </div>
              <div className="panel-center">SUBMISSION HISTORY</div>
              <div className="panel-right">
                <button onClick={() => setShowSubmissionHistoryPopup(false)}>X</button>
              </div>
            </div>

            {/* Content */}
            <div className="my-profile-section">
              <table className="submission-history-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Hazard Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Quezon City, Philippines, Barangay Commonwealth</td>
                    <td>Flooding, Rainfall</td>
                    <td>
                      <button className="view-chat-button">View Chat</button>
                      <button className="view-result-button">View Result</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Makati City, Philippines, Barangay 505</td>
                    <td>Flooding, Rainfall, Heat Index</td>
                    <td>
                      <button className="view-chat-button">View Chat</button>
                      <button className="view-result-button">View Result</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Cebu City, Philippines, Barangay 102</td>
                    <td>Flooding, Rainfall, Heat Index</td>
                    <td>
                      <button className="view-chat-button">View Chat</button>
                      <button className="view-result-button">View Result</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* Profile Pop-up */}
      {showProfilePopup && (
        <div className="profile-popup-overlay">
          <div className="profile-popup">
            {/* Panel */}
            <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
              <div className="panel-left">
                <button
                  className={showProfilePopup ? "active" : ""}
                  onClick={() => { setShowProfilePopup(true); setShowSubmissionHistoryPopup(false); }}
                >
                  <img
                    src={showProfilePopup ? "/icons/profile.png" : "/icons/greenprofile.png"}
                    alt="Profile"
                  />
                </button>
                <button
                  className={showSubmissionHistoryPopup ? "active" : ""}
                  onClick={() => { setShowSubmissionHistoryPopup(true); setShowProfilePopup(false); }}
                >
                  <img
                    src={showSubmissionHistoryPopup ? "/icons/result.png" : "/icons/greenresult.png"}
                    alt="Submission History"
                  />
                </button>
              </div>
              <div className="panel-center">PROFILE</div>
              <div className="panel-right">
                <button onClick={toggleProfilePopup}>X</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
              <button
                className={activeTab === "myProfile" ? "active" : ""}
                onClick={() => setActiveTab("myProfile")}
              >
                My Profile
              </button>
              <button
                className={activeTab === "changePassword" ? "active" : ""}
                onClick={() => setActiveTab("changePassword")}
              >
                Change Password
              </button>
            </div>

            {/* My Profile Section */}
            {activeTab === "myProfile" && (
              <div className="my-profile-section">
                {/* Name and Role Side by Side */}
                <div className="name-role-container">
                  <div className="input-group">
                    <label>Name</label>
                    <input type="text" />
                  </div>
                  <div className="input-group">
                    <label>Role</label>
                    <input type="text" />
                  </div>
                </div>

                {/* Email and Username */}
                <div className="input-group">
                  <label>Email</label>
                  <input type="text" style={{ width: "542px" }} />
                </div>
                <div className="input-group">
                  <label>Username</label>
                  <input type="text" style={{ width: "542px" }} />
                </div>
              </div>
            )}

            {/* Change Password Section */}
            {activeTab === "changePassword" && (
              <div className="change-password-section">
                <div className="input-group">
                  <label>Current Password</label>
                  <input type="password" style={{ width: "542px" }} />
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <input type="password" style={{ width: "542px" }} />
                </div>
                <div className="input-group">
                  <label>Confirm New Password</label>
                  <input type="password" style={{ width: "542px" }} />
                </div>
              </div>
            )}

            {/* Update Button */}
            <div className="update-button-container">
              <button className="update-button">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Result Pop-up */}
      {showResultPopup && (
        <div className="profile-popup-overlay">
          <div className="profile-popup">
            {/* Panel */}
            <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
              <div className="panel-left">
                <button
                  className={showResultPopup ? "active" : ""}
                  onClick={() => { /* Add functionality for Assessment Result */ }}
                >
                  <img
                    src={showResultPopup ? "/icons/result.png" : "/icons/result.png"}
                    alt="Assessment Result"
                  />
                </button>
                <button
                  className={showChatbotPopup ? "active" : ""}
                  onClick={() => { setShowChatbotPopup(true); setShowResultPopup(false); }}
                >
                  <img
                    src={showChatbotPopup ? "/icons/chatbot.png" : "/icons/chatbot.png"}
                    alt="Chat Bot"
                  />
                </button>
              </div>

              <div className="panel-right">
                <button onClick={() => setShowResultPopup(false)}>X</button>
              </div>
            </div>

            {/* Top Panel */}
            <div className="result-top-panel">
              ASSESSMENT RESULTS
            </div>

            {/* Content Panels */}
            <div className="result-content">
              <div className="result-content-panel">
                Flooding Assessment
              </div>
              <div className="result-content-panel">
                Rainfall Assessment
              </div>
              <div className="result-content-panel">
                Heat Index Assessment
              </div>
            </div>

            {/* Bottom Panel */}
            <div className="result-bottom-panel">
              <button className="view-report-button">
                View Result with AI Recommendation (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Pop-up */}
      {showChatbotPopup && (
        <div className="profile-popup-overlay">
          <div className="profile-popup">
            {/* Panel */}
            <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
              <div className="panel-left">
                <button
                  className={showResultPopup ? "active" : ""}
                  onClick={() => { setShowResultPopup(true); setShowChatbotPopup(false); }}
                >
                  <img src="/icons/result.png" alt="Assessment Result" />
                </button>
                <button
                  className={showChatbotPopup ? "active" : ""}
                  onClick={() => { /* Chat Bot already active */ }}
                >
                  <img src="/icons/chatbot.png" alt="Chat Bot" />
                </button>
              </div>

              <div className="panel-right">
                <button onClick={() => setShowChatbotPopup(false)}>x</button>
              </div>
            </div>

            {/* Top Panel */}
            <div className="chatbot-top-panel">
              CHATBOT
            </div>

            {/* Chat Content */}
            <div className="chat-content">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.sender === "bot" && <img src="/icons/chatbot.png" alt="Bot" className="chat-icon" />}
                  <div className="chat-bubble">{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="chat-input-container">
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Enter your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>➤</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Sidebar;