import React, { useState } from "react";
import "./Popup.css";

const ProfilePopup = ({ onClose }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(true);
  const [showSubmissionHistoryPopup, setShowSubmissionHistoryPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("myProfile");

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
    onClose(); // Ensure it closes the popup from the parent component
  };

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        {/* Panel */}
        <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
          <div className="panel-left">
            <button
              className={showProfilePopup ? "active" : ""}
              onClick={() => {
                setShowProfilePopup(true);
                setShowSubmissionHistoryPopup(false);
              }}
            >
              <img
                src={showProfilePopup ? "/icons/profile.png" : "/icons/greenprofile.png"}
                alt="Profile"
              />
            </button>
            <button
              className={showSubmissionHistoryPopup ? "active" : ""}
              onClick={() => {
                setShowSubmissionHistoryPopup(true);
                setShowProfilePopup(false);
              }}
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
  );
};

export default ProfilePopup;
