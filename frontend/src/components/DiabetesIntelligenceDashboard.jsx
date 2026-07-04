import React from "react";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaTint, FaWeight, FaSyringe, FaUserMd, FaAppleAlt, FaRunning, FaExclamationTriangle } from "react-icons/fa";
import "./DiseaseIntelligence.css";

const DiabetesIntelligenceDashboard = ({ result }) => {
  const navigate = useNavigate();
  if (!result || !result.input_data) return null;

  const riskLevel = result.risk_level || "Low";
  const probability = Math.round(Number(result.risk_percentage));
  const input = result.input_data;
  
  // Clinical Markers
  const glucose = Number(input.Glucose || input.glucose || 0);
  const bmi = Number(input.BMI || input.bmi || 0);
  const insulin = Number(input.Insulin || input.insulin || 0);
  const age = Number(input.Age || input.age || 0);
  
  const getRiskColor = (level) => {
    switch (level) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      default: return "#10b981";
    }
  };
  const riskColor = getRiskColor(riskLevel);

  const recommendations = [
    { icon: <FaAppleAlt />, title: "Nutrition", desc: "Maintain balanced glycemic meals." },
    { icon: <FaRunning />, title: "Activity", desc: "Ensure consistent weekly activity." },
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
              <h2>High Diabetes Risk Detected</h2>
            </div>
          </div>
          <p className="alert-message">Your clinical indicators suggest significantly elevated diabetes risk. Immediate professional evaluation is strongly recommended.</p>
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
          <h2 className="risk-title">{riskLevel} Diabetes Assessment</h2>
          <div className="prob-text">Probability: {result.risk_percentage}%</div>
          <p className="risk-subtitle">{result.risk_level} Risk detected. {riskLevel === 'Low' ? 'Continue healthy habits.' : 'Immediate preventive action recommended.'}</p>
        </div>
      </div>

      {/* 3. Biomarkers */}
      <div className="marker-grid">
        {[ { label: 'Glucose', val: `${glucose} mg/dL`, icon: <FaTint />, status: glucose > 125 ? 'Critical' : 'Normal' }, 
           { label: 'BMI', val: bmi, icon: <FaWeight />, status: bmi > 25 ? 'High' : 'Healthy' }, 
           { label: 'Insulin', val: `${insulin} μU/mL`, icon: <FaSyringe />, status: 'Normal' }, 
           { label: 'Age', val: age, icon: <FaUserMd />, status: 'N/A' } ].map((m, i) => (
          <div key={i} className="marker-card">
            <div className="marker-icon">{m.icon}</div>
            <div>
              <small>{m.label}</small>
              <strong>{m.val}</strong>
            </div>
            <span className={`marker-status ${m.status.toLowerCase()}`}>{m.status}</span>
          </div>
        ))}
      </div>

      {/* 4. Interpretation */}
      <div className="content-grid">
        <div className="interpretation-card">
          <h4><FaBrain /> AI Clinical Interpretation</h4>
          <p className="interpretation-content">
            {typeof result.explanation === "string" 
              ? result.explanation 
              : (result.explanation?.summary || "Analysis based on clinical markers.")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DiabetesIntelligenceDashboard;
