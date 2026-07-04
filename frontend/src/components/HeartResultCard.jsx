import React from "react";
import { motion } from "framer-motion";
import {
  FaBrain,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeartbeat,
  FaShieldAlt,
  FaStethoscope,
  FaTint,
  FaWalking,
} from "react-icons/fa";
import XAIExplanation from "./XAIExplanation";
import "./HeartResultCard.css";

const HeartResultCard = ({ result, diseaseType = "Heart" }) => {
  if (!result) return null;

  const probability = Math.round(Number(result.risk_percentage || 0));
  const riskLevel = result.risk_level || (
    probability >= 70 ? "High" : probability >= 40 ? "Medium" : "Low"
  );

  const riskClass = riskLevel === "High"
    ? "high-risk"
    : riskLevel === "Medium"
      ? "medium-risk"
      : "low-risk";

  const input = result.input_data || {};
  const explanationText = typeof result.explanation === "string"
    ? result.explanation
    : result.explanation?.summary || "Analysis complete. Please review these results with your healthcare provider.";

  const resultMessage = riskLevel === "High"
    ? "Elevated cardiovascular risk detected. Please review the key markers and seek professional evaluation."
    : riskLevel === "Medium"
      ? "Moderate cardiovascular risk pattern detected. Lifestyle action and follow-up monitoring are recommended."
      : "Current indicators suggest a low cardiovascular risk profile. Continue healthy habits and periodic screening.";

  const markerData = [
    {
      label: "Blood Pressure",
      value: input.trestbps ? `${input.trestbps} mmHg` : "N/A",
      icon: <FaTint />,
      status: Number(input.trestbps || 0) >= 140 ? "High" : "Normal",
    },
    {
      label: "Cholesterol",
      value: input.chol ? `${input.chol} mg/dL` : "N/A",
      icon: <FaHeartbeat />,
      status: Number(input.chol || 0) >= 240 ? "High" : "Healthy",
    },
    {
      label: "Max Heart Rate",
      value: input.thalach ? `${input.thalach} bpm` : "N/A",
      icon: <FaChartLine />,
      status: Number(input.thalach || 0) < 100 ? "Low" : "Measured",
    },
    {
      label: "Exercise Angina",
      value: Number(input.exang || 0) === 1 ? "Yes" : "No",
      icon: <FaWalking />,
      status: Number(input.exang || 0) === 1 ? "Flagged" : "Clear",
    },
  ];

  return (
    <motion.div
      className={`heart-result-card glass-card ${riskClass}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="heart-result-header">
        <div>
          <span className="heart-result-eyebrow">AI risk analysis complete</span>
          <h3>{diseaseType} Risk Result</h3>
        </div>
        <span className={`heart-status-pill ${riskClass}`}>
          {riskLevel} Risk
        </span>
      </div>

      <div className="heart-result-hero">
        <div className={`heart-icon-orb ${riskClass}`}>
          {riskLevel === "High" ? <FaExclamationTriangle /> : <FaCheckCircle />}
        </div>

        <div className="heart-primary-copy">
          <span>Cardiovascular screening</span>
          <h2>{riskLevel} Heart Risk Assessment</h2>
          <p>{resultMessage}</p>
        </div>

        <div className="heart-score-card">
          <div
            className={`heart-score-dial ${riskClass}`}
            style={{ "--score": `${Math.min(probability, 100)}%` }}
          >
            <div className="heart-score-inner">
              <strong>{probability}%</strong>
              <span>probability</span>
            </div>
          </div>
        </div>
      </div>

      <div className="heart-metrics-row">
        <div className="heart-metric">
          <span>Clinical priority</span>
          <strong>{riskLevel === "High" ? "Cardiology review" : riskLevel === "Medium" ? "Monitor closely" : "Routine follow-up"}</strong>
        </div>
        <div className="heart-metric">
          <span>Model signal</span>
          <strong><FaBrain /> {probability >= 70 ? "Strong" : probability >= 40 ? "Moderate" : "Low"}</strong>
        </div>
        <div className="heart-metric">
          <span>Data privacy</span>
          <strong><FaShieldAlt /> Encrypted</strong>
        </div>
      </div>

      <div className="heart-section-title">
        <span>Cardiac intelligence</span>
        <h4>Key Heart Markers</h4>
        <p>Clinical inputs used by the prediction engine, organized for quick review.</p>
      </div>

      <div className="heart-marker-grid">
        {markerData.map((marker) => (
          <div key={marker.label} className="heart-marker-card">
            <div className="heart-marker-icon">{marker.icon}</div>
            <div>
              <small>{marker.label}</small>
              <strong>{marker.value}</strong>
            </div>
            <span className={`heart-marker-status ${marker.status.toLowerCase()}`}>
              {marker.status}
            </span>
          </div>
        ))}
      </div>

      <div className="heart-analysis-grid">
        <div className="heart-interpretation-card">
          <h4><FaStethoscope /> Clinical Summary</h4>
          <p>{explanationText}</p>
        </div>

        <div className="heart-xai-card">
          <div className="heart-xai-header">
            <FaBrain />
            <div>
              <h4>AI Decision Analysis</h4>
              <p>Top factors and next-step recommendations.</p>
            </div>
          </div>
          <XAIExplanation
            explanation={result.explanation}
            prediction={result}
            diseaseType={diseaseType}
            features={result.explanation?.top_contributing_factors}
          />
        </div>
      </div>

      <div className="heart-result-footer">
        <span>This AI result supports screening and does not replace a diagnosis.</span>
      </div>
    </motion.div>
  );
};

export default HeartResultCard;
