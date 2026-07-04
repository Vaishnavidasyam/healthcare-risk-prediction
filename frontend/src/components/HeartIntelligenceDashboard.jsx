import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaBrain, FaHeartbeat, FaTint, FaRunning, FaStethoscope, FaAppleAlt, FaExclamationTriangle } from "react-icons/fa";
import "./DiseaseIntelligence.css";

const HeartIntelligenceDashboard = ({ result }) => {
  const navigate = useNavigate();
  if (!result || !result.input_data) return null;

  const riskLevel = result.risk_level || "Low";
  const probability = Math.round(Number(result.risk_percentage));
  const input = result.input_data;
  
  // Clinical Markers
  const bp = Number(input.trestbps || input.BloodPressure || 0);
  const chol = Number(input.chol || input.Cholesterol || 0);
  const thalach = Number(input.thalach || input.MaxHeartRate || 0);
  const age = Number(input.age || input.Age || 0);
  
  const getRiskColor = (level) => {
    switch (level) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      default: return "#10b981";
    }
  };
  const riskColor = getRiskColor(riskLevel);

  const markers = [
    { label: "Blood Pressure", value: `${bp} mmHg`, icon: <FaTint />, status: bp > 140 ? "High" : "Normal" },
    { label: "Cholesterol", value: `${chol} mg/dL`, icon: <FaHeartbeat />, status: chol > 240 ? "High" : "Healthy" },
    { label: "Heart Rate", value: `${thalach} bpm`, icon: <FaRunning />, status: thalach < 100 ? "Low" : "Normal" },
    { label: "Age", value: `${age} yrs`, icon: <FaStethoscope />, status: "N/A" },
  ];

  const recommendations = [
    { icon: <FaAppleAlt />, title: "Nutrition", desc: "Heart-healthy dietary plan." },
    { icon: <FaRunning />, title: "Activity", desc: "Maintain regular movement." },
  ];

  return (
    <motion.div className="intelligence-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* 1. Critical Alert */}
      {riskLevel === "High" && (
        <motion.div className="critical-alert-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="alert-header">
            <FaExclamationTriangle className="alert-icon" />
            <div className="alert-titles">
              <span className="alert-badge">Critical Alert</span>
              <h2>High Heart Risk Detected</h2>
            </div>
          </div>
          <p className="alert-message">Your clinical indicators suggest elevated cardiovascular risk. Professional evaluation is recommended.</p>
        </motion.div>
      )}

      {/* 2. Hero Assessment */}
      <div className="hero-card-unified">
        <div className="hero-gauge">
          <CircularProgressbar 
            value={probability} 
            text={`${probability}%`}
            styles={buildStyles({ pathColor: riskColor, textColor: 'var(--text-main)', trailColor: 'var(--border-color)', textSize: '28px' })} 
          />
        </div>
        <div className="hero-content">
          <span className={`risk-badge ${riskLevel.toLowerCase()}`}>{riskLevel} Risk</span>
          <h2 className="risk-title">{riskLevel} Heart Assessment</h2>
          <div className="prob-text">Probability: {result.risk_percentage}%</div>
          <p className="risk-subtitle">{result.risk_level} Risk detected. {riskLevel === 'Low' ? 'Continue healthy habits.' : 'Immediate preventive action recommended.'}</p>
        </div>
      </div>

      {/* 3. Biomarkers */}
      <div className="marker-grid">
        {markers.map((m, i) => (
          <div key={i} className="marker-card">
            <div className="marker-icon">{m.icon}</div>
            <div>
              <small>{m.label}</small>
              <strong>{m.value}</strong>
            </div>
            <span className={`marker-status ${m.status.toLowerCase()}`}>{m.status}</span>
          </div>
        ))}
      </div>

      {/* 4. Interpretation */}
      <div className="content-grid">
        <div className="interpretation-card" style={{gridColumn: "span 2"}}>
          <h4><FaBrain /> AI Clinical Interpretation</h4>
          <p className="interpretation-content">
            {typeof result.explanation === "string"
              ? result.explanation
              : result.explanation?.summary || "Analysis based on clinical markers."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeartIntelligenceDashboard;
