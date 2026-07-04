import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecommendations } from "../context/RecommendationContext";
import {
  FaBrain,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaStethoscope,
  FaTint,
  FaWeight,
  FaSyringe,
  FaUserMd,
  FaFlask,
  FaHeartbeat,
  FaNotesMedical,
  FaUtensils,
  FaRunning,
  FaHistory
} from "react-icons/fa";
import XAIExplanation from "./XAIExplanation";
import "./RiskResultCard.css";

const RiskResultCard = ({ result, diseaseType = "Health" }) => {
  const navigate = useNavigate();
  const { updateAssessment } = useRecommendations();

  useEffect(() => {
    if (result) {
      // Create a simplified version for comparison if needed, or just check if data is different
      const newAssessment = {
        ...result,
        diseaseType,
        timestamp: new Date().toISOString()
      };
      
      // Prevent unnecessary updates by checking against current context (if exposed)
      // For now, let's just make sure we aren't updating if the core result hasn't changed
      updateAssessment(newAssessment);
    }
  }, [result, diseaseType]); // Removed updateAssessment from dependencies, as it shouldn't change

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
    : result.explanation?.summary || `Analysis complete. Our AI models have evaluated your clinical markers for ${diseaseType.toLowerCase()} risk.`;

  const resultMessage = riskLevel === "High"
    ? `Elevated ${diseaseType.toLowerCase()} risk detected. Please review the key markers and seek professional evaluation.`
    : riskLevel === "Medium"
      ? `Moderate ${diseaseType.toLowerCase()} risk pattern detected. Lifestyle action and follow-up monitoring are recommended.`
      : `Current indicators suggest a low ${diseaseType.toLowerCase()} risk profile. Continue healthy habits and periodic screening.`;

  // Dynamic markers based on disease type. 
  // IMPORTANT: Ensure keys match the actual keys in 'result.input_data' returned by the backend.
  let markerData = [];
  if (diseaseType === "Diabetes") {
    // Backend returns keys like 'Glucose', 'BMI', 'Insulin', 'Age'
    markerData = [
      { label: "Glucose", value: `${input.Glucose || 0} mg/dL`, icon: <FaTint />, status: Number(input.Glucose || 0) > 125 ? "High" : "Normal" },
      { label: "BMI", value: input.BMI || 0, icon: <FaWeight />, status: Number(input.BMI || 0) > 25 ? "High" : "Healthy" },
      { label: "Insulin", value: `${input.Insulin || 0} μU/mL`, icon: <FaSyringe />, status: Number(input.Insulin || 0) > 100 ? "High" : "Normal" },
      { label: "Age", value: input.Age || 0, icon: <FaUserMd />, status: Number(input.Age || 0) >= 45 ? "Flagged" : "Baseline" },
    ];
  } else if (diseaseType === "Kidney") {
    // Backend returns keys like 'sc', 'bu', 'hemo', 'al'
    markerData = [
      { label: "Creatinine", value: `${input.sc || 0} mg/dL`, icon: <FaFlask />, status: Number(input.sc || 0) > 1.4 ? "High" : "Normal" },
      { label: "Blood Urea", value: `${input.bu || 0} mg/dL`, icon: <FaTint />, status: Number(input.bu || 0) > 35 ? "High" : "Normal" },
      { label: "Hemoglobin", value: `${input.hemo || 0} g/dL`, icon: <FaHeartbeat />, status: Number(input.hemo || 0) < 12 ? "Low" : "Stable" },
      { label: "Albumin", value: input.al || 0, icon: <FaNotesMedical />, status: Number(input.al || 0) > 0 ? "Flagged" : "Clear" },
    ];
  } else {
    // Default/Heart - Backend returns keys like 'trestbps', 'chol', 'thalach', 'age'
    markerData = [
      { label: "Blood Pressure", value: `${input.trestbps || 0} mmHg`, icon: <FaTint />, status: Number(input.trestbps || 0) >= 140 ? "High" : "Normal" },
      { label: "Cholesterol", value: `${input.chol || 0} mg/dL`, icon: <FaHeartbeat />, status: Number(input.chol || 0) >= 240 ? "High" : "Healthy" },
      { label: "Max Heart Rate", value: input.thalach || 0, icon: <FaChartLine />, status: Number(input.thalach || 0) < 100 ? "Low" : "Normal" },
      { label: "Age", value: input.age || 0, icon: <FaUserMd />, status: "N/A" },
    ];
  }

  return (
    <motion.div
      className={`risk-result-card glass-card ${riskClass}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="risk-result-header">
        <div>
          <span className="risk-result-eyebrow">AI risk analysis complete</span>
          <h3>{diseaseType} Risk Assessment</h3>
        </div>
        <span className={`risk-status-pill ${riskClass}`}>
          {riskLevel} Risk
        </span>
      </div>

      <div className="risk-result-hero">
        <div className={`risk-icon-orb ${riskClass}`}>
          {riskLevel === "High" ? <FaExclamationTriangle /> : <FaCheckCircle />}
        </div>

        <div className="risk-primary-copy">
          <span>Clinical Screening</span>
          <h2>{riskLevel} {diseaseType} Risk</h2>
          <p>{resultMessage}</p>
        </div>

        <div className="risk-score-card">
          <div
            className={`risk-score-dial ${riskClass}`}
            style={{ "--score": `${Math.min(probability, 100)}%` }}
          >
            <div className="risk-score-inner">
              <strong>{probability}%</strong>
              <span>probability</span>
            </div>
          </div>
        </div>
      </div>

      <div className="risk-metrics-row">
        <div className="risk-metric">
          <span>Clinical priority</span>
          <strong>{riskLevel === "High" ? "Urgent Review" : riskLevel === "Medium" ? "Early Intervention" : "Standard Care"}</strong>
        </div>
        <div className="risk-metric">
          <span>Model confidence</span>
          <strong><FaBrain /> {probability >= 70 || probability <= 20 ? "High" : "Moderate"}</strong>
        </div>
        <div className="risk-metric">
          <span>Encryption</span>
          <strong><FaShieldAlt /> Protocol HIPAA</strong>
        </div>
      </div>

      <div className="risk-section-title">
        <span>Clinical Intelligence</span>
        <h4>Key Health Markers</h4>
        <p>Biometric signals used by our neural network for this assessment.</p>
      </div>

      <div className="risk-marker-grid">
        {markerData.map((marker) => (
          <div key={marker.label} className="risk-marker-card">
            <div className="risk-marker-icon">{marker.icon}</div>
            <div>
              <small>{marker.label}</small>
              <strong>{marker.value}</strong>
            </div>
            <span className={`risk-marker-status ${marker.status.toLowerCase()}`}>
              {marker.status}
            </span>
          </div>
        ))}
      </div>

      <div className="risk-analysis-grid">
        <div className="risk-interpretation-card">
          <h4><FaStethoscope /> Clinical Summary</h4>
          <p>{explanationText}</p>
        </div>

        <div className="risk-xai-card">
          <div className="risk-xai-header">
            <FaBrain />
            <div>
              <h4>AI Decision Logic</h4>
              <p>Contributing factors identified by XAI.</p>
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

      <div className="risk-result-footer">
        <span>SmartMed AI assessment is for screening purposes and does not substitute professional medical diagnosis.</span>
      </div>
    </motion.div>
  );
};

export default RiskResultCard;
