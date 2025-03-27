import React, { useState } from "react";
import "../Sidebar.css";

const ProfilePopup = ({ onClose, showSubmissionHistoryPopup, setShowSubmissionHistoryPopup, setShowProfilePopup }) => {
  const [activeTab, setActiveTab] = useState("myProfile");

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
            <button onClick={onClose}>X</button>
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