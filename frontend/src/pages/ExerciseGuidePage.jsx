import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecommendations } from "../context/RecommendationContext";
import { 
  FaRunning, FaCheckCircle, FaExclamationTriangle, FaArrowRight, 
  FaClock, FaFire, FaDumbbell, FaInfoCircle, FaCalendarAlt, FaShieldAlt
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./PremiumContent.css";
import { PremiumHeroBanner, PremiumCard } from "../components/PremiumUI";

const ExerciseGuidePage = () => {
  const { getRecommendations, latestAssessment } = useRecommendations();
  const navigate = useNavigate();
  const recommendations = getRecommendations();

  if (!recommendations || !latestAssessment) {
    return (
      <div className="premium-page-container">
        <div className="empty-state glass-card">
          <FaInfoCircle />
          <h2>No Active Assessment Found</h2>
          <p>Complete a health assessment to generate your personalized fitness strategy.</p>
          <button className="btn-premium btn-primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { exercise } = recommendations;
  const { diseaseType, risk_level, risk_percentage } = latestAssessment;
  const fitnessReadiness = 85; // Mock logic

  const stats = [
    { label: "Weekly Target", value: "150 min", icon: <FaCalendarAlt /> },
    { label: "Daily Goal", value: exercise.duration, icon: <FaClock /> },
    { label: "Burn Goal", value: "1200 kcal", icon: <FaFire /> },
    { label: "Intensity", value: exercise.intensity, icon: <FaDumbbell /> },
  ];

  return (
    <div className="premium-page-container">
      <PremiumHeroBanner 
        eyebrow="Personalized Fitness Intelligence"
        title="Clinical Exercise Guide"
        description={`Tailored for ${diseaseType} risk management (${risk_level} Risk).`}
        icon={<FaRunning />}
      />

      <div className="premium-grid-layout">
        <PremiumCard title="Your Exercise Strategy" icon={<FaShieldAlt />} className="full-width-card">
          <p className="strategy-text">Based on your {risk_level} {diseaseType} Risk assessment, {exercise.intensity.toLowerCase()} activity can improve metabolic health, support weight management, and reduce future risk progression.</p>
        </PremiumCard>

        <motion.div className="glass-card fitness-readiness-card" whileHover={{ scale: 1.02 }}>
          <div className="card-header-premium"><h3>Fitness Readiness</h3></div>
          <div className="readiness-gauge">
            <CircularProgressbar 
              value={fitnessReadiness} 
              text={`${fitnessReadiness}`} 
              styles={buildStyles({ pathColor: 'var(--medical-blue)', textColor: 'var(--text-primary)', trailColor: 'var(--bg-secondary)' })}
            />
          </div>
          <p className="readiness-status">Status: Excellent</p>
        </motion.div>

        {stats.map((stat, i) => (
          <div key={i} className="glass-card stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <PremiumCard title="Today's Recommended Exercises" icon={<FaRunning />} className="full-width-card">
        <div className="exercise-list">
          {exercise.plan.map((act, i) => (
            <div key={i} className="exercise-card">
              <h4>{act}</h4>
              <p>Duration: {exercise.duration}</p>
              <button className="btn-premium btn-primary">Start Activity</button>
            </div>
          ))}
        </div>
      </PremiumCard>

      {risk_level === 'High' && (
        <motion.div className="critical-alert-card glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="alert-header">
            <FaExclamationTriangle className="alert-icon" />
            <h3>Emergency Warning</h3>
          </div>
          <p>Stop exercise immediately if chest pain or severe shortness of breath occurs. Monitor blood markers strictly.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ExerciseGuidePage;
