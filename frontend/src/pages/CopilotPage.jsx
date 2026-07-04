import React, { useState, useEffect, useRef } from "react";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaBrain,
  FaMicrophone,
  FaPlus,
  FaCommentMedical,
  FaInfoCircle,
  FaVolumeUp,
  FaStopCircle,
  FaWaveSquare,
  FaTrash
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/client";
import { toast } from "react-hot-toast";

import "./CopilotPage.css";

const CopilotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSessions = async () => {
    setLoading(true);
    setConnectionError(false);
    try {
      const res = await api.get("/copilot/chat/sessions");
      const sessionsData = res.data.sessions || [];
      setSessions(sessionsData);
      
      // Load the most recent session only if no session is currently selected
      if (sessionsData.length > 0 && !currentSessionId) {
        loadSession(sessionsData[0]._id);
      } else if (sessionsData.length === 0) {
        startNewChat();
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setConnectionError(true);
      toast.error("Unable to connect to healthcare engine.");
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    setHistoryLoading(true);
    try {
      setCurrentSessionId(sessionId);
      const res = await api.get(`/copilot/chat/${sessionId}/history`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error loading chat history:", err);
      toast.error("Failed to load clinical history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      const res = await api.post("/copilot/chat/new");
      const newSessionId = res.data.session_id;
      
      // Immediately load the new session to show the greeting from DB
      await loadSession(newSessionId);
      // Refresh session list to include the new one
      const listRes = await api.get("/copilot/chat/sessions");
      setSessions(listRes.data.sessions || []);
    } catch (err) {
      console.error("Failed to start chat:", err);
      toast.error("Clinical node connection failed.");
    }
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this clinical session?")) return;

    try {
      await api.delete(`/copilot/chat/${sessionId}`);
      toast.success("Session deleted.");
      if (currentSessionId === sessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }
      fetchSessions();
    } catch (err) {
      toast.error("Failed to delete session.");
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    
    if (!currentSessionId && !connectionError) {
      toast.error("Initializing session... please wait.");
      return;
    }

    if (connectionError) {
      toast.error("Cannot send message: Engine is offline.");
      return;
    }

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      let healthContext = null;
      try {
        const summaryRes = await api.get("/health/dashboard-summary");
        healthContext = {
          latest_health_score: summaryRes.data.health_score,
          top_recommendations: summaryRes.data.top_recommendations
        };
      } catch (contextErr) {
        console.warn("Could not fetch health context:", contextErr);
      }

      const res = await api.post(`/copilot/chat/${currentSessionId}/message`, {
        message: currentInput,
        health_context: healthContext
      });

      if (res.data.status === "success" || res.data.message) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: res.data.message,
          timestamp: new Date().toISOString()
        }]);
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err.response?.data?.message || err.message || "AI node timeout.";
      toast.error(`Chat Error: ${errorMessage}`);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting to my medical reasoning engine. Please check if the backend server is running and try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice synthesis unsupported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const renderMessageContent = (content) => {
    // Basic structured text formatter for neat clinical alignment
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed && index !== lines.length - 1) return <div key={index} style={{height: '8px'}} />;

      // Handle Bullet Points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const text = trimmed.substring(2);
        return (
          <div key={index} className="clinical-list-item" style={{display: 'flex', gap: '10px', paddingLeft: '12px', marginBottom: '6px'}}>
            <span style={{color: 'var(--medical-blue)', fontWeight: 'bold'}}>•</span>
            <span style={{flex: 1}}>{parseBold(text)}</span>
          </div>
        );
      }
      
      // Handle Numbered Lists
      if (/^\d+\.\s/.test(trimmed)) {
        const firstDot = trimmed.indexOf('.');
        const number = trimmed.substring(0, firstDot + 1);
        const text = trimmed.substring(firstDot + 1).trim();
        return (
          <div key={index} className="clinical-list-item" style={{display: 'flex', gap: '10px', paddingLeft: '12px', marginBottom: '8px'}}>
            <span style={{color: 'var(--medical-blue)', fontWeight: 'bold', minWidth: '20px'}}>{number}</span>
            <span style={{flex: 1}}>{parseBold(text)}</span>
          </div>
        );
      }

      // Default paragraph
      return (
        <p key={index} style={{marginBottom: '12px', textAlign: 'justify'}}>
          {parseBold(line)}
        </p>
      );
    });
  };

  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{fontWeight: 800, color: 'var(--medical-blue-light)'}}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="copilot-enterprise-page">
      <div className="copilot-layout-premium">
        {/* SIDEBAR */}
        <div className="copilot-history-sidebar">
          <div className="sidebar-top-actions">
            <button 
              className="btn-premium btn-primary full-width" 
              onClick={startNewChat}
              disabled={connectionError || loading}
            >
              <FaPlus /> New Clinical Session
            </button>
          </div>
          
          <div className="chat-sessions-list">
            <h5 className="sidebar-label">RECENT SESSIONS</h5>
            {loading ? (
              <div className="empty-state">Syncing history...</div>
            ) : connectionError ? (
              <div className="empty-state error">
                <p>Healthcare node unreachable.</p>
                <button className="btn-text" onClick={fetchSessions}>Retry Connection</button>
              </div>
            ) : sessions.length === 0 ? (
              <div className="empty-state">No clinical sessions found.</div>
            ) : (
              sessions.map(s => (
                <div 
                  key={s._id} 
                  className={`session-pill ${currentSessionId === s._id ? "active" : ""}`}
                  onClick={() => loadSession(s._id)}
                >
                  <FaCommentMedical />
                  <div className="s-info">
                    <strong>{s.first_message || "Diagnostic Query"}</strong>
                    <span>{new Date(s.updated_at).toLocaleDateString()}</span>
                  </div>
                  <button 
                    className="delete-session-btn" 
                    onClick={(e) => handleDeleteSession(e, s._id)}
                    title="Delete Session"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="copilot-compliance-card">
            <FaInfoCircle />
            <p>Clinical data is encrypted via TLS 1.3. AI responses are generated using medical reasoning engines.</p>
          </div>
        </div>

        {/* MAIN CHAT */}
        <div className="chat-viewport-premium">
          <header className="chat-header-premium">
            <div className="ai-profile-flex">
              <div className="ai-avatar-glow">
                <FaRobot />
                <span className="status-dot"></span>
              </div>
              <div className="ai-meta">
                <h2>SmartMed <span>Copilot</span></h2>
                <span className="clinical-badge">Clinical Mode Active</span>
              </div>
            </div>
            <div className="chat-tools">
              <div className="tool-chip"><FaWaveSquare /> Neural Sync</div>
            </div>
          </header>

          <div className="messages-container-premium">
            {connectionError ? (
              <div className="analysis-empty-premium">
                <FaInfoCircle className="bg-icon-fade" />
                <h2>Connection Refused</h2>
                <p>The backend server at 127.0.0.1:5000 is unreachable.</p>
                <p style={{fontSize: '12px', marginTop: '10px'}}>Please ensure you have started the backend with: <br/><strong>cd backend && python app.py</strong></p>
                <button 
                  className="btn-premium btn-primary" 
                  style={{marginTop: '20px'}}
                  onClick={fetchSessions}
                >
                  Try Reconnecting
                </button>
              </div>
            ) : historyLoading ? (
              <div className="analysis-empty-premium">
                <div className="loader-ring"></div>
                <p>Retrieving session data...</p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`message-bubble-row ${msg.role}`}
                    >
                      <div className="bubble-avatar">
                        {msg.role === "assistant" ? <FaRobot /> : <FaUser />}
                      </div>
                      <div className="bubble-content-box">
                        <div className="bubble-text">{renderMessageContent(msg.content)}</div>
                        <div className="bubble-footer">
                          <span className="time">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          {msg.role === "assistant" && <button className="voice-out-btn"><FaVolumeUp /></button>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <div className="typing-indicator-premium">
                    <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <footer className="chat-input-area-premium">
            <div className="suggested-prompts">
              <button 
                onClick={() => setInput("Explain my cardiovascular risk markers")}
                disabled={connectionError}
              >
                Explain Cardiac Markers
              </button>
              <button 
                onClick={() => setInput("What are the risk factors for my metabolic score?")}
                disabled={connectionError}
              >
                Analyze Metabolic Score
              </button>
            </div>
            
            <form className="clinical-input-form" onSubmit={handleSendMessage}>
              <button 
                type="button" 
                className={`input-tool-btn ${isListening ? "active-voice" : ""}`}
                onClick={handleVoiceInput}
                disabled={connectionError}
              >
                {isListening ? <FaStopCircle /> : <FaMicrophone />}
              </button>
              
              <input 
                type="text" 
                placeholder={connectionError ? "Engine offline..." : "Ask your healthcare intelligence assistant..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={connectionError}
              />
              
              <button 
                type="submit" 
                className="send-clinical-btn" 
                disabled={!input.trim() || isTyping || connectionError}
              >
                <FaPaperPlane />
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CopilotPage;
