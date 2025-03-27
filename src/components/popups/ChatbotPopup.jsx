import React, { useState } from "react";
import "../Sidebar.css";

const ChatbotPopup = ({ onClose, showResultPopup, setShowResultPopup, setShowChatbotPopup }) => {
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

  return (
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
              className={true ? "active" : ""} // Always active since we're in chatbot
              onClick={() => {}}
            >
              <img src="/icons/chatbot.png" alt="Chat Bot" />
            </button>
          </div>

          <div className="panel-right">
            <button onClick={onClose}>x</button>
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
  );
};

export default ChatbotPopup;