// frontend/src/components/RecommendationCard.jsx
// Premium Health Recommendation Card

import React from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaAppleAlt,
  FaRunning,
  FaMoon,
  FaHeart,
  FaBrain,
  FaWater,
  FaWalking,
  FaDumbbell,
  FaUtensils,
  FaBed,
  FaMedkit,
  FaChartLine,
} from "react-icons/fa";

const RecommendationCard = ({
  category = "nutrition",
  title = "Improve Your Diet",
  description = "Increase your daily fiber intake by adding more whole grains and vegetables to your meals.",
  priority = "high", // high, medium, low
  progress = 0,
  target = "",
  icon = null,
  completed = false,
  onClick,
  className = "",
}) => {
  // Category icons
  const categoryIcons = {
    nutrition: <FaAppleAlt />,
    exercise: <FaRunning />,
    sleep: <FaMoon />,
    cardiovascular: <FaHeart />,
    mental: <FaBrain />,
    hydration: <FaWater />,
    activity: <FaWalking />,
    strength: <FaDumbbell />,
    diet: <FaUtensils />,
    rest: <FaBed />,
    medication: <FaMedkit />,
    monitoring: <FaChartLine />,
  };

  const displayIcon = icon || categoryIcons[category] || <FaCheck />;

  // Priority colors
  const priorityConfig = {
    high: {
      color: "var(--status-danger)",
      bg: "var(--status-danger-bg)",
      label: "High Priority",
    },
    medium: {
      color: "var(--status-warning)",
      bg: "var(--status-warning-bg)",
      label: "Medium Priority",
    },
    low: {
      color: "var(--status-info)",
      bg: "var(--status-info-bg)",
      label: "Low Priority",
    },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    hover: {
      y: -4,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className={`recommendation-card glass-card ${completed ? "completed" : ""} ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
    >
      {/* Header */}
      <div className="rec-card-header">
        <div className="rec-icon-wrapper" style={{ background: config.bg }}>
          <span style={{ color: config.color }}>{displayIcon}</span>
        </div>
        <div className="rec-header-info">
          <span className="rec-priority" style={{ color: config.color }}>
            {config.label}
          </span>
          <h4 className="rec-title">{title}</h4>
        </div>
        {completed && (
          <div className="rec-completed-badge">
            <FaCheck />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="rec-description">{description}</p>

      {/* Target */}
      {target && (
        <div className="rec-target">
          <span className="target-label">Target:</span>
          <span className="target-value">{target}</span>
        </div>
      )}

      {/* Progress */}
      {progress > 0 && (
        <div className="rec-progress">
          <div className="progress-header">
            <span className="progress-label">Progress</span>
            <span className="progress-value">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
                background: completed ? "var(--status-success)" : config.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Action */}
      {onClick && (
        <button className="rec-action-btn">
          {completed ? "View Details" : "Start Now"}
        </button>
      )}
    </motion.div>
  );
};

// Recommendation List Component
export const RecommendationList = ({
  recommendations = [],
  onSelect,
  className = "",
}) => {
  return (
    <div className={`recommendation-list ${className}`}>
      {recommendations.map((rec, index) => (
        <RecommendationCard
          key={index}
          {...rec}
          onClick={() => onSelect && onSelect(rec)}
        />
      ))}
    </div>
  );
};

export default RecommendationCard;
