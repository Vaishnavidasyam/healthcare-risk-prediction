import React from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import "./XAIExplanation.css";

const XAIExplanation = ({ prediction, features = [], explanation, diseaseType = "Heart" }) => {
  const riskLevel = prediction?.risk_level?.toLowerCase() || "low";
  
  const featureNameMapping = {
    "age": "Age",
    "sex": "Sex",
    "cp": "Chest Pain Type",
    "trestbps": "Resting Blood Pressure",
    "chol": "Cholesterol",
    "fbs": "Fasting Blood Sugar",
    "restecg": "Resting ECG",
    "thalach": "Max Heart Rate",
    "exang": "Exercise Induced Angina",
    "oldpeak": "ST Depression",
    "slope": "Slope",
    "ca": "Major Vessels",
    "thal": "Thalassemia",
    "bmi": "BMI",
    "glucose": "Glucose"
  };

  // Correct mapping of backend structure
  const displayFeatures = (features && features.length > 0) ? features.map(f => ({
    name: featureNameMapping[f.feature?.toLowerCase()] || f.feature || "Unknown",
    value: f.value || 0,
    unit: f.unit || "", // Backend doesn't provide unit yet, will add logic later if needed
    impact: f.contribution_percentage ? (f.contribution_percentage / 100) : (f.importance || 0)
  })) : []; // Return empty if no backend features provided

  return (
    <div className={`xai-premium-container ${riskLevel}-risk-theme`}>
      
      {/* 1. Feature Importance Analysis */}
      {displayFeatures.length > 0 && (
        <div className="features-section">
          <div className="section-header-title">
            <h3>Feature Importance Analysis</h3>
            <p className="subtitle">Clinical factors contributing to prediction</p>
          </div>
          <div className="features-grid-premium">
            {displayFeatures.sort((a, b) => b.impact - a.impact).map((f, i) => {
              // Simple heuristic for status since backend doesn't provide 'normal' range yet
              const isHigh = f.impact > 0.1; // Simple heuristic for now
              const status = isHigh ? "Above Normal" : "Normal";
              const percentage = Math.round(f.impact * 100);
              return (
                <motion.div key={f.name} className="feature-card glass-card" whileHover={{ y: -5 }}>
                  <div className="feature-top">
                    <span className="rank-badge">#{i + 1}</span>
                    <h4 className="feature-title">{f.name}</h4>
                    <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
                  </div>
                  
                  <div className="feature-value-row">
                    <span className="clinical-value">{f.value} <small>{f.unit}</small></span>
                  </div>
                  
                  <div className="contribution-row">
                    <span className="label">Contribution</span>
                    <span className="value">{percentage}%</span>
                  </div>
                  
                  <div className="progress-bar-track">
                    <motion.div 
                      className="progress-bar-fill" 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Personalized Recommendations */}
      <div className="recommendations-section">
        <h3>Personalized Recommendations</h3>
        <div className="rec-grid">
          {[
            { text: "Reduce saturated fat intake", desc: "Lower LDL cholesterol", action: "View Diet Plan", path: "/diet-plan" },
            { text: "Increase physical activity", desc: "Target 150 min/week", action: "Exercise Guide", path: "/exercise-guide" },
            { text: "Monitor blood pressure", desc: "Track readings daily", action: "Track BP", path: "/bp-tracker" },
            { text: "Consult a cardiologist", desc: "Professional evaluation", action: "Find Specialist", path: "/specialists" }
          ].map((rec, i) => (
            <motion.div key={i} className="rec-card glass-card" whileHover={{ y: -5 }}>
              <div className="rec-content">
                <FaCheck className="rec-check" /> 
                <div className="rec-info">
                  <h4>{rec.text}</h4>
                  <p>{rec.desc}</p>
                </div>
              </div>
              <button className="btn-outline" onClick={() => window.location.href = rec.path}>
                {rec.action} <FaArrowRight />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XAIExplanation;
