import React, { useState } from "react";
import "./Popup.css";

const ResultPopup = ({ onClose }) => {
  const [showChatbotPopup, setShowChatbotPopup] = useState(false);

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        {/* Panel */}
        <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
          <div className="panel-left">
            <button className="active">
              <img src="/icons/result.png" alt="Assessment Result" />
            </button>
            <button
              className={showChatbotPopup ? "active" : ""}
              onClick={() => setShowChatbotPopup(true)}
            >
              <img src="/icons/chatbot.png" alt="Chat Bot" />
            </button>
          </div>

          <div className="panel-right">
            <button onClick={onClose}>X</button>
          </div>
        </div>

        {/* Top Panel */}
        <div className="result-top-panel">ASSESSMENT RESULTS</div>

        {/* Content Panels */}
        <div className="result-content">
          <div className="result-content-panel">Flooding Assessment</div>
          <div className="result-content-panel">Rainfall Assessment</div>
          <div className="result-content-panel">Heat Index Assessment</div>
        </div>

        {/* Bottom Panel */}
        <div className="result-bottom-panel">
          <button className="view-report-button">
            View Assessment with AI Recommendation (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
