// frontend/src/components/EmergencyAlert.jsx
// Healthcare Emergency Alert System

import React from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaAmbulance,
  FaPhoneAlt,
  FaHospital,
  FaUserMd,
  FaClock,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

const EmergencyAlert = ({
  severity = "critical", // critical, warning, info
  title = "Health Alert",
  message = "Your health indicators require immediate attention.",
  recommendedAction = "Book a specialist consultation immediately.",
  specialist = "Cardiologist",
  showDismiss = true,
  onDismiss,
  onBookAppointment,
  onViewGuidelines,
  className = "",
}) => {
  const severityConfig = {
    critical: {
      bgColor: "var(--status-danger-bg)",
      borderColor: "var(--status-danger)",
      iconColor: "var(--status-danger)",
      icon: <FaExclamationTriangle />,
      animation: "shake",
    },
    warning: {
      bgColor: "var(--status-warning-bg)",
      borderColor: "var(--status-warning)",
      iconColor: "var(--status-warning)",
      icon: <FaExclamationTriangle />,
      animation: "pulse",
    },
    info: {
      bgColor: "var(--status-info-bg)",
      borderColor: "var(--status-info)",
      iconColor: "var(--status-info)",
      icon: <FaClock />,
      animation: "none",
    },
  };

  const config = severityConfig[severity];

  const alertVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className={`emergency-alert ${severity} ${className}`}
      style={{
        "--alert-bg": config.bgColor,
        "--alert-border": config.borderColor,
        "--alert-icon": config.iconColor,
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={alertVariants}
    >
      {/* Alert Icon */}
      <div className={`alert-icon ${config.animation}`}>
        <div className="icon-wrapper">{config.icon}</div>
      </div>

      {/* Alert Content */}
      <div className="alert-content">
        <div className="alert-header">
          <span className="alert-severity-badge">{severity.toUpperCase()}</span>
          <h3 className="alert-title">{title}</h3>
        </div>
        <p className="alert-message">{message}</p>

        {/* Recommended Action */}
        <div className="alert-action-box">
          <div className="action-header">
            <FaUserMd />
            <span>Recommended Action</span>
          </div>
          <p>{recommendedAction}</p>

          {specialist && (
            <div className="specialist-info">
              <FaHospital />
              <span>
                Recommended Specialist: <strong>{specialist}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="alert-actions">
          {onBookAppointment && (
            <button
              className="btn-premium btn-danger"
              onClick={onBookAppointment}
            >
              <FaPhoneAlt />
              Book Specialist Now
            </button>
          )}
          {onViewGuidelines && (
            <button
              className="btn-premium btn-outline"
              onClick={onViewGuidelines}
            >
              View Guidelines
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* Dismiss Button */}
      {showDismiss && onDismiss && (
        <button className="alert-dismiss" onClick={onDismiss}>
          <FaTimes />
        </button>
      )}
    </motion.div>
  );
};

// Quick Alert Component for inline use
export const QuickAlert = ({ type = "info", message, compact = false }) => {
  const typeConfig = {
    success: { color: "var(--status-success)", bg: "var(--status-success-bg)" },
    warning: { color: "var(--status-warning)", bg: "var(--status-warning-bg)" },
    danger: { color: "var(--status-danger)", bg: "var(--status-danger-bg)" },
    info: { color: "var(--status-info)", bg: "var(--status-info-bg)" },
  };

  const config = typeConfig[type];

  return (
    <motion.div
      className={`quick-alert ${type} ${compact ? "compact" : ""}`}
      style={{ "--alert-color": config.color, "--alert-bg": config.bg }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="quick-alert-dot" style={{ background: config.color }} />
      <span className="quick-alert-message">{message}</span>
    </motion.div>
  );
};

export default EmergencyAlert;
