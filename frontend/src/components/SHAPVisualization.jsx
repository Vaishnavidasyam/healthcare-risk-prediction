import React from "react";
import { motion } from "framer-motion";
import { FaChartBar } from "react-icons/fa";
import "./SHAPVisualization.css";

const SHAPVisualization = ({ features = [] }) => {
  if (!features || features.length === 0) return null;

  const sortedFeatures = [...features].sort((a, b) => b.impact - a.impact);

  return (
    <div className="shap-viz-wrapper">
      <div className="section-header">
        <div className="header-icon"><FaChartBar /></div>
        <div className="header-text">
          <h3>Feature Importance Analysis</h3>
          <p className="subtitle">Clinical factors contributing to prediction</p>
        </div>
      </div>
      
      <div className="features-grid-premium">
        {sortedFeatures.map((f, i) => {
          const percentage = Math.round(f.impact * 100);
          return (
            <motion.div 
              key={f.name} 
              className="feature-card glass-card compact"
              whileHover={{ y: -2 }}
            >
              <div className="feature-top">
                <span className="rank-badge">#{i + 1}</span>
                <h4 className="feature-title">{f.name}</h4>
                <span className="feature-val">{f.value} {f.unit}</span>
              </div>
              
              <div className="contribution-compact">
                <div className="progress-bar-track">
                  <motion.div 
                    className="progress-bar-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="value">{percentage}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SHAPVisualization;
