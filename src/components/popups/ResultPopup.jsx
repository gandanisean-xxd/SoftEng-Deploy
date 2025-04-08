import React from "react";
import "./PopupStyles.css";

const ResultPopup = ({ onClose, showChatbotPopup, setShowChatbotPopup, setShowResultPopup, darkMode }) => {
  return (
    <div className="profile-popup-overlay">
      <div className={`profile-popup ${darkMode ? "dark-mode" : ""}`}>
        {/* Panel */}
        <div className="profile-panel">
          <div className="panel-left">
            <button
              className={true ? "active" : ""}
              onClick={() => {}}
            >
              <img src="/icons/result.png" alt="Assessment Result" />
            </button>
            <button
              className={showChatbotPopup ? "active" : ""}
              onClick={() => { setShowChatbotPopup(true); setShowResultPopup(false); }}
            >
              <img src="/icons/chatbot.png" alt="Chat Bot" />
            </button>
          </div>

          <div className="panel-right">
            <button onClick={onClose}>
              <img src="/icons/close.png" alt="Close" className="close-icon" />
            </button>
          </div>
        </div>

        {/* Top Panel */}
        <div className="result-top-panel">
          ASSESSMENT RESULTS
        </div>

        {/* Content Panels */}
        <div className="result-content">
          <div className="result-content-panel">Flooding Assessment</div>
          <div className="result-content-panel">Rainfall Assessment</div>
          <div className="result-content-panel">Heat Index Assessment</div>
        </div>

        {/* Bottom Panel */}
        <div className="result-bottom-panel">
          <button className="view-report-button">
            View Result with AI Recommendation (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};


export default ResultPopup;