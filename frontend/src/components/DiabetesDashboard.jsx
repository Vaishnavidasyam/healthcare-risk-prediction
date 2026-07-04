import React from "react";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaTint, FaWeight, FaSyringe, FaUsers, FaEye, FaKidney, FaHeartbeat, FaBrain, FaCheck, FaArrowRight } from "react-icons/fa";
import "./DiabetesDashboard.css";

const DiabetesDashboard = ({ result }) => {
  if (!result || !result.input_data) return null;

  // Robustly handle input data with potential casing differences
  const input = result.input_data;
  const glucose = Number(input.Glucose || input.glucose) || 0;
  const bmi = Number(input.BMI || input.bmi) || 0;
  const insulin = Number(input.Insulin || input.insulin) || 0;
  const pregnancies = Number(input.Pregnancies || input.pregnancies) || 0;
  
  const riskLevel = result.risk_level || "Low";
  const isElevated = glucose > 100;

  const getComplicationRisk = (level) => {
    switch (level) {
      case "High": return "High";
      case "Medium": return "Moderate";
      default: return "Low";
    }
  };

  const complicationRisk = getComplicationRisk(riskLevel);

  const complications = [
    { name: "Eye Complications", risk: complicationRisk },
    { name: "Kidney Disease", risk: complicationRisk },
    { name: "Heart Disease", risk: complicationRisk },
    { name: "Nerve Damage", risk: complicationRisk }
  ];

  // Dynamic recommendations based on risk
  const getRecommendations = (risk) => {
    if (risk === "High") return [
      { text: "Immediate Consultation", desc: "Contact an endocrinologist today", action: "Find Specialist", path: "/specialists" },
      { text: "Strict Glycemic Control", desc: "Follow prescribed medication", action: "Track Glucose", path: "/bp-tracker" }
    ];
    return [
      { text: "Reduce sugar intake", desc: "Lower glycemic load", action: "View Diet Plan", path: "/diet-plan" },
      { text: "Regular activity", desc: "150 min exercise/week", action: "Exercise Guide", path: "/exercise-guide" }
    ];
  };

  const recommendations = getRecommendations(riskLevel);

  return (
    <motion.div className="diabetes-dashboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="metrics-grid">
        {/* Glucose Analysis Card */}
        <div className="glucose-analysis-card glass-card">
          <h3>Glucose Analysis</h3>
          <div className="glucose-gauge-wrapper">
            <div className="gauge">
              <CircularProgressbar 
                value={Math.min(glucose, 200)} 
                text={`${glucose}`}
                styles={buildStyles({ pathColor: isElevated ? '#ef4444' : 'var(--status-success)', textColor: 'var(--text-primary)', textSize: '24px' })}
              />
            </div>
            <div className="glucose-info">
              <span>Current Level</span>
              <strong>{glucose} <small>mg/dL</small></strong>
              <span className={`status-pill ${isElevated ? 'elevated' : 'normal'}`}>{isElevated ? 'Elevated' : 'Normal'}</span>
            </div>
          </div>
        </div>

        {/* Potential Complications Card */}
        <div className="complications-card glass-card">
          <h3>Potential Complication Risks</h3>
          <div className="complications-list">
            {complications.map((c, i) => (
              <div key={i} className="complication-card">
                <div className="comp-title">{c.name}</div>
                <div className={`comp-risk ${c.risk.toLowerCase()}-risk`}>{c.risk} Risk</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section">
        <h3>Personalized Recommendations</h3>
        <div className="rec-grid">
          {recommendations.map((rec, i) => (
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
    </motion.div>
  );
};

export default DiabetesDashboard;
