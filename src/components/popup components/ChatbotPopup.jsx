import React, { useState } from "react";
import "./sidebar.css";

const ChatbotPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showChatbotPopup, setShowChatbotPopup] = useState(true);

  // Handle sending message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMessage = { text: newMessage, sender: "user" };
    const botReply = { text: "This is a sample bot response.", sender: "bot" };

    setMessages([...messages, userMessage, botReply]);
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
              onClick={() => {
                setShowResultPopup(true);
                setShowChatbotPopup(false);
              }}
            >
              <img src="/icons/result.png" alt="Assessment Result" />
            </button>
            <button className={showChatbotPopup ? "active" : ""}>
              <img src="/icons/chatbot.png" alt="Chat Bot" />
            </button>
          </div>

          <div className="panel-right">
            <button onClick={onClose}>x</button>
          </div>
        </div>

        {/* Top Panel */}
        <div className="chatbot-top-panel">CHATBOT</div>

        {/* Chat Content */}
        <div className="chat-content">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.sender === "bot" && (
                <img src="/icons/chatbot.png" alt="Bot" className="chat-icon" />
              )}
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPopup;
