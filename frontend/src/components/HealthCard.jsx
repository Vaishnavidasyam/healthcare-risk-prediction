// frontend/src/components/HealthCard.jsx

import React from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
} from "react-icons/fa";

import "./HealthCard.css";

const getStatusClass = (level) => {
  if (level === "High") return "high";
  if (level === "Medium") return "medium";
  if (level === "Low") return "low";

  return "unknown";
};

const getTrendIcon = (level) => {
  if (level === "High") {
    return <FaArrowUp />;
  }

  if (level === "Low") {
    return <FaArrowDown />;
  }

  return <FaHeartbeat />;
};

const getHealthIcon = (title) => {
  if (title.toLowerCase().includes("heart")) {
    return <FaHeartbeat />;
  }

  if (title.toLowerCase().includes("diabetes")) {
    return <FaTint />;
  }

  if (title.toLowerCase().includes("kidney")) {
    return <FaNotesMedical />;
  }

  return <FaHeartbeat />;
};

const getRecommendation = (level) => {
  if (level === "High") {
    return "Immediate medical consultation is recommended.";
  }

  if (level === "Medium") {
    return "Maintain healthy habits and monitor regularly.";
  }

  if (level === "Low") {
    return "Your current health indicators look stable.";
  }

  return "Run a prediction to see your health insights.";
};

const HealthCard = ({
  title,
  level = "Unknown",
  percentage = 0,
  description,
}) => {
  return (
    <div className={`health-card ${getStatusClass(level)}`}>
      {/* TOP */}
      <div className="health-card-header">
        <div className="health-card-icon">{getHealthIcon(title)}</div>

        <div className="health-card-title-section">
          <h4>{title}</h4>

          <span className={`health-status ${getStatusClass(level)}`}>
            {level}
          </span>
        </div>
      </div>

      {/* MAIN RISK */}
      <div className="health-card-main">
        <div className="health-risk-number">{percentage}%</div>

        <div className="health-risk-trend">
          {getTrendIcon(level)}

          <span>
            {level === "High"
              ? "Risk Increased"
              : level === "Low"
                ? "Healthy Status"
                : "Moderate Risk"}
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="health-card-body">
        <p>{description || getRecommendation(level)}</p>
      </div>

      {/* FOOTER */}
      <div className="health-card-footer">
        <div className="health-progress">
          <div
            className={`health-progress-fill ${getStatusClass(level)}`}
            style={{
              width: `${Math.min(percentage, 100)}%`,
            }}
          ></div>
        </div>

        <div className="health-footer-labels">
          <span>Risk Score</span>

          <span>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;
