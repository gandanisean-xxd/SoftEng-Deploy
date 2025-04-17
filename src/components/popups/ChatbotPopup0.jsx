import React, { useState } from "react";
import axios from "axios";
import "./PopupStyles.css";

const ChatbotPopup = ({ onClose, showResultPopup, setShowResultPopup, setShowChatbotPopup, darkMode }) => {
  const [messages, setMessages] = useState([
    { sender: "user", text: "Why is this place prone to flooding?" },
    {
      sender: "bot",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    // Add user message to chat
    setMessages([...messages, { sender: "user", text: newMessage }]);

    try {
        // Send message to Flask server
        const response = await axios.post('http://localhost:5000/chat', { message: newMessage });
        const botMessage = response.data.response;

        // Add bot response to chat
        setMessages(prevMessages => [...prevMessages, { sender: "bot", text: botMessage }]);
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Sorry, something went wrong." }]);
    }

    // Clear the input textbox
    setNewMessage("");
};

  return (
    <div className="profile-popup-overlay">
      <div className={`profile-popup ${darkMode ? "dark-mode" : ""}`}>
        <div className="profile-panel" style={{ backgroundColor: "#41AB5D" }}>
          <div className="panel-left">
            <button
              className={showResultPopup ? "active" : ""}
              onClick={() => { setShowResultPopup(true); setShowChatbotPopup(false); }}
            >
              <img src="/icons/result.png" alt="Assessment Result" />
            </button>
            <button
              className="active" // Always active since we're in chatbot
              onClick={() => {}}
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

        <div className="chatbot-top-panel">
          CHATBOT
        </div>

        <div className="chat-content">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.sender === "bot" && <img src="/icons/chatbot.png" alt="Bot" className="chat-icon" />}
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
        </div>

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