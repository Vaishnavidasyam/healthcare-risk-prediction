// frontend/src/components/HealthcareCopilot.jsx
// Premium AI Healthcare Assistant Chat Interface

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaTrash,
  FaDownload,
  FaCopy,
  FaCheck,
  FaSpinner,
  FaBrain,
  FaHeartbeat,
  FaPills,
  FaRunning,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const HealthcareCopilot = ({
  userId = "user-001",
  userName = "User",
  className = "",
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "welcome",
      content:
        "Hello! I'm your AI Healthcare Copilot. I can help you understand your health reports, explain medical terms, and provide personalized health guidance. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Suggested prompts
  const suggestions = [
    { icon: <FaBrain />, text: "Explain my recent lab results" },
    { icon: <FaHeartbeat />, text: "What does high cholesterol mean?" },
    { icon: <FaPills />, text: "Medication interaction check" },
    { icon: <FaRunning />, text: "Create a fitness plan" },
    { icon: <FaMoon />, text: "Improve my sleep quality" },
    { icon: <FaSun />, text: "Diet recommendations" },
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate AI response (simulated)
  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000),
    );

    // Smart responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    let response = "";

    if (
      lowerMessage.includes("lab") ||
      lowerMessage.includes("report") ||
      lowerMessage.includes("result")
    ) {
      response =
        "Based on your recent lab results, I can see a few areas to focus on. Your glucose levels are within normal range, but your LDL cholesterol is slightly elevated. I recommend increasing fiber intake and regular exercise. Would you like me to create a detailed analysis?";
    } else if (lowerMessage.includes("cholesterol")) {
      response =
        "High cholesterol means there's too much LDL (bad) cholesterol in your blood. This can lead to plaque buildup in your arteries, increasing heart disease risk. Key actions: reduce saturated fats, increase soluble fiber, exercise regularly, and consider omega-3 supplements. Your current level is 165 mg/dL - we should aim for below 100 mg/dL.";
    } else if (
      lowerMessage.includes("medication") ||
      lowerMessage.includes("drug")
    ) {
      response =
        "I can help review medication interactions. Please share your current medications, and I'll check for any potential interactions or side effects. Always consult your healthcare provider before making any changes to your medication regimen.";
    } else if (
      lowerMessage.includes("fitness") ||
      lowerMessage.includes("exercise") ||
      lowerMessage.includes("workout")
    ) {
      response =
        "Based on your health profile, I recommend a balanced fitness routine: 150 minutes of moderate cardio per week, 2-3 strength training sessions, and daily flexibility exercises. Start with 30-minute walks and gradually increase intensity. Would you like a personalized weekly plan?";
    } else if (lowerMessage.includes("sleep")) {
      response =
        "For better sleep quality, try these evidence-based strategies: maintain a consistent sleep schedule (7-9 hours), avoid screens 1 hour before bed, keep your room cool (65-68°F), limit caffeine after 2 PM, and consider magnesium supplementation. Your sleep score has improved 12% this month!";
    } else if (
      lowerMessage.includes("diet") ||
      lowerMessage.includes("food") ||
      lowerMessage.includes("nutrition")
    ) {
      response =
        "Based on your health goals, focus on: Mediterranean-style diet rich in vegetables, fruits, whole grains, and lean proteins. Limit processed foods, reduce sodium intake to <2300mg/day, and stay hydrated (8-10 glasses water). Your current nutrition score is 72/100 - we can get that to 85+ with these changes.";
    } else {
      response =
        "I understand your concern. Let me provide some general guidance based on your health profile. Your overall health score is trending positively (+4% this month). For specific medical advice, I recommend consulting with your healthcare provider. Is there a particular aspect of your health you'd like to focus on?";
    }

    setIsTyping(false);

    return {
      id: Date.now(),
      type: "ai",
      content: response,
      timestamp: new Date().toISOString(),
    };
  };

  // Send message
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowSuggestions(false);

    // Generate AI response
    const aiResponse = await generateAIResponse(content);
    setMessages((prev) => [...prev, aiResponse]);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion.text);
  };

  // Toggle voice recording (simulated)
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // In real app, process recorded audio
      sendMessage("Voice transcription would appear here...");
    } else {
      setIsRecording(true);
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: "welcome",
        content: "Chat cleared. How can I assist you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setShowSuggestions(true);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Copy message
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Could show toast notification
  };

  return (
    <div className={`healthcare-copilot ${className}`}>
      {/* Header */}
      <div className="copilot-header">
        <div className="copilot-brand">
          <div className="copilot-avatar">
            <FaRobot />
          </div>
          <div className="copilot-info">
            <h3>Healthcare Copilot</h3>
            <span className="status-online">
              <span className="pulse-dot"></span>
              Online • AI-Powered
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={clearChat} title="Clear Chat">
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="copilot-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Avatar */}
              <div className="message-avatar">
                {message.type === "ai" ? (
                  <div className="ai-avatar">
                    <FaRobot />
                  </div>
                ) : (
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.content}</p>
                </div>
                <div className="message-meta">
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.type === "ai" && (
                    <button
                      className="copy-btn"
                      onClick={() => copyMessage(message.content)}
                      title="Copy"
                    >
                      <FaCopy />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            className="message typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="message-avatar">
              <div className="ai-avatar">
                <FaRobot />
              </div>
            </div>
            <div className="message-content">
              <div className="typing-bubble">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">AI is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && messages.length < 3 && (
        <div className="suggestions-container">
          <p className="suggestions-label">Quick Questions</p>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                className="suggestion-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-icon">{suggestion.icon}</span>
                <span className="suggestion-text">{suggestion.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="copilot-input-area">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your health..."
              disabled={isRecording}
            />
            <button
              type="button"
              className={`voice-btn ${isRecording ? "recording" : ""}`}
              onClick={toggleRecording}
              title="Voice Input"
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>
          </div>
          <button
            type="submit"
            className="send-btn"
            disabled={!inputValue.trim() || isTyping}
          >
            <FaPaperPlane />
          </button>
        </form>
        <p className="disclaimer">
          AI responses are for informational purposes only. Always consult a
          healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
};

export default HealthcareCopilot;
