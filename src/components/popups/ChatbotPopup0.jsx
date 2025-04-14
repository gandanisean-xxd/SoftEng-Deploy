import React, { useState } from "react";
import axios from "axios";
import "./PopupStyles.css";

const ChatbotPopup = ({ onClose, showResultPopup, setShowResultPopup, setShowChatbotPopup, darkMode }) => {
  const getGreeting = () => {
    const greetings = [
      "Hello! 👋 I'm your virtual assistant. How can I help you today?",
      "Hi there! 😊 What would you like to know?",
      "Greetings! 🌟 I'm here to assist you. What can I do for you?",
      "Hey! 🙌 Feel free to ask me anything.",
      "Welcome! 🎉 What can I do for you today?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const [messages, setMessages] = useState([
    { sender: "bot", text: getGreeting() },
    { sender: "bot", text: "Feel free to ask me anything about our services, or just say hi!" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    // Add user message to chat
    const userMessage = { sender: "user", text: newMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Check for greeting responses
    const greetingResponses = {
      "hi": "Hello! 👋 How can I assist you today?",
      "hello": "Hi there! 😊 What would you like to know?",
      "hey": "Hey! 🙌 Feel free to ask me anything.",
      "greetings": "Greetings! 🌟 I'm here to help.",
      "welcome": "Welcome! 🎉 What can I do for you today?"
    };

    const userInputLower = newMessage.toLowerCase();
    if (greetingResponses[userInputLower]) {
      const botResponse = greetingResponses[userInputLower];
      setMessages(prevMessages => [...prevMessages, { sender: "bot", text: botResponse }]);
      setNewMessage(""); // Clear input immediately
      return; // Exit the function early
    }

    // Set loading state
    setLoading(true);

    try {
      // Send message to Flask server
      const response = await axios.post('http://localhost:5000/chat', { message: newMessage });
      const botMessage = response.data.response;

      // Add bot response to chat
      setMessages(prevMessages => [...prevMessages, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      // Reset loading state
      setLoading(false);
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
          {loading && (
            <div className="chat-message bot">
              <div className="chat-bubble">Typing...</div>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <div className="chat-input">
            <input
              type="text"
              placeholder="Enter your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading} // Disable input while loading
            />
            <button onClick={handleSendMessage} disabled={loading}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPopup;