import React from "react";
import "./PopupStyles.css";
import ChatbotPopup from "./ChatbotPopup0"; 
import ResultPopup from "./ResultPopup";
import { useState } from "react";


const SubmissionHistoryPopup = ({ onClose, showProfilePopup, setShowProfilePopup, setShowSubmissionHistoryPopup, selectedHazards }) => {

  const [showChatbotPopup, setShowChatbotPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);

  const submissions = [
    { id: 1, location: "Quezon City...", hazards: ["Flooding", "Rainfall"] },
    { id: 2, location: "Makati City...", hazards: ["Flooding", "Rainfall", "Heat Index"] },
    { id: 3, location: "Cebu City...", hazards: ["Flooding", "Rainfall", "Heat Index"] },
  ];

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
            <button onClick={onClose}>
              <img src="/icons/close.png" alt="Close" className="close-icon" />
            </button>
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
                    <div className="submission-buttons">
                      <button className="view-chat-button" onClick={() =>  setShowChatbotPopup(true)}>View Chat</button>
                      <button className="view-result-button" onClick={() => setShowResultPopup(true)}>View Result</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Makati City, Philippines, Barangay 505</td>
                  <td>Flooding, Rainfall, Heat Index</td>
                  <td>
                    <div className="submission-buttons">
                      <button className="view-chat-button" onClick={() => setShowChatbotPopup(true)}>View Chat</button>
                      <button className="view-result-button" onClick={() => setShowResultPopup(true)}>View Result</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Cebu City, Philippines, Barangay 102</td>
                  <td>Flooding, Rainfall, Heat Index</td>
                  <td>
                    <div className="submission-buttons">
                      <button className="view-chat-button" onClick={() => setShowChatbotPopup(true)}>View Chat</button>
                      <button className="view-result-button" onClick={() => setShowResultPopup(true)}>View Result</button>
                    </div>
                  </td>
                </tr>
              </tbody>
          </table>
        </div>
      </div>
      {showChatbotPopup && (
        <ChatbotPopup
          onClose={() => setShowChatbotPopup(false)}
          showResultPopup={showResultPopup}
          setShowResultPopup={setShowResultPopup}
          setShowChatbotPopup={setShowChatbotPopup}
          darkMode={false} // or true if needed
        />
      )}

      {showResultPopup && (
        <ResultPopup
          onClose={() => setShowResultPopup(false)}
          showChatbotPopup={showChatbotPopup}
          setShowChatbotPopup={setShowChatbotPopup}
          setShowResultPopup={setShowResultPopup}
          selectedHazards={selectedHazards}
          darkMode={false} // or true if needed
        />
      )}

    </div>
    
  );
};

export default SubmissionHistoryPopup;