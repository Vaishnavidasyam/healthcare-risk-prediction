import React from "react";
import { FaTint, FaWeight, FaSyringe, FaUsers } from "react-icons/fa";
import "./MetabolicMetrics.css";

const MetabolicMetrics = ({ data }) => {
  if (!data) return null;

  const metrics = [
    { label: "Glucose", value: data.Glucose, unit: "mg/dL", icon: <FaTint /> },
    { label: "BMI", value: data.BMI, unit: "", icon: <FaWeight /> },
    { label: "Insulin", value: data.Insulin, unit: "mu U/ml", icon: <FaSyringe /> },
    { label: "Pregnancies", value: data.Pregnancies, unit: "", icon: <FaUsers /> },
  ];

  return (
    <div className="metabolic-metrics-grid">
      {metrics.map((m, i) => (
        <div key={i} className="metric-card">
          <div className="metric-icon">{m.icon}</div>
          <div className="metric-info">
            <span className="metric-label">{m.label}</span>
            <strong className="metric-value">{m.value} <small>{m.unit}</small></strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetabolicMetrics;
