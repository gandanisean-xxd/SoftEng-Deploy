import React from "react";
import "../Sidebar.css";

const SubmissionHistoryPopup = ({ onClose, showProfilePopup, setShowProfilePopup, setShowSubmissionHistoryPopup }) => {
  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        {/* Panel */}
        <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
          <div className="panel-left">
            <button
              className={showProfilePopup ? "active" : ""}
              onClick={() => { setShowProfilePopup(true); setShowSubmissionHistoryPopup(false); }}
            >
              <img src="/icons/profile.png" alt="Profile" />
            </button>
            <button
              className={true ? "active" : ""} // Always active since we're in submission history
              onClick={() => {}}
            >
              <img src="/icons/result.png" alt="Submission History" />
            </button>
          </div>
          <div className="panel-center">SUBMISSION HISTORY</div>
          <div className="panel-right">
            <button onClick={onClose}>X</button>
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
  );
};

export default SubmissionHistoryPopup;