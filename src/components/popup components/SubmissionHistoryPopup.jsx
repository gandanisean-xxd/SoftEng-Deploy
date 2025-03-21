import React, { useState } from "react";
import "./sidebar.css";

const SubmissionHistoryPopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("submissionHistory");

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        {/* Panel */}
        <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
          <div className="panel-left">
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <img
                src={activeTab === "profile" ? "/icons/profile.png" : "/icons/greenprofile.png"}
                alt="Profile"
              />
            </button>
            <button
              className={activeTab === "submissionHistory" ? "active" : ""}
              onClick={() => setActiveTab("submissionHistory")}
            >
              <img
                src={activeTab === "submissionHistory" ? "/icons/result.png" : "/icons/greenresult.png"}
                alt="Submission History"
              />
            </button>
          </div>
          <div className="panel-center">SUBMISSION HISTORY</div>
          <div className="panel-right">
            <button onClick={onClose}>X</button>
          </div>
        </div>

        {/* Content */}
        <div className="my-profile-section">
          <p>Submission history content will be added here.</p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistoryPopup;
