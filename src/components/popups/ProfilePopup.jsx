import React, { useState } from "react";
import "./PopupStyles.css";

const ProfilePopup = ({ onClose, showSubmissionHistoryPopup, setShowSubmissionHistoryPopup, setShowProfilePopup }) => {
  const [activeTab, setActiveTab] = useState("myProfile");

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        {/* Panel */}
        <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
          <div className="panel-left">
            <button
              className={true ? "active" : ""} // Always active since we're in profile
              onClick={() => { setShowProfilePopup(true); setShowSubmissionHistoryPopup(false); }}
            >
              <img src="/icons/profile.png" alt="Profile" />
            </button>
            <button
              className={showSubmissionHistoryPopup ? "active" : ""}
              onClick={() => { setShowSubmissionHistoryPopup(true); setShowProfilePopup(false); }}
            >
              <img src="/icons/result.png" alt="Submission History" />
            </button>
          </div>
          <div className="panel-center">PROFILE</div>
          <div className="panel-right">
            <button onClick={onClose}>
              <img src="/icons/close.png" alt="Close" className="close-icon" />
            </button>
          </div>
        </div>

        {activeTab === "myProfile" && (
        <div className="profile-popup1">
          {/* Background overlays */}
          <div className="background-layer" />
          <div className="image-overlay" />
          <div className="top-fade-overlay" />
          <div className="right-geo" />
          <div className="left-geo" />

          {/* Profile content */}
          <div className="profile-content">
            <div className="profile-info">
              <div className="info-card">
                <div className="icon">
                  <img src="/icons/profile.png" alt="User Icon" />
                </div>
                <div>
                  <div className="label">Username</div>
                  <div className="value">John Doe</div>
                </div>
              </div>

              <div className="info-card">
                <div className="icon">
                  <img src="/icons/email.png" alt="Email Icon" />
                </div>
                <div>
                  <div className="label">Email</div>
                  <div className="value">johndoe@example.com</div>
                </div>
              </div>

              <div className="info-card">
                <div className="icon">
                  <img src="/icons/role.png" alt="Role Icon" />
                </div>
                <div>
                  <div className="label">Role</div>
                  <div className="value">Urban Planner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      </div>
    </div>
  );
};

export default ProfilePopup;