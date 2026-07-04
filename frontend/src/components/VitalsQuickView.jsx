// frontend/src/components/VitalsQuickView.jsx
import React from "react";
import { FaHeartbeat, FaTint, FaThermometerHalf, FaWeight } from "react-icons/fa";
import "./VitalsQuickView.css";

const VitalsQuickView = () => {
  const vitals = [
    { label: "Heart Rate", value: "72", unit: "bpm", icon: <FaHeartbeat /> },
    { label: "Glucose", value: "98", unit: "mg/dL", icon: <FaTint /> },
    { label: "Weight", value: "70", unit: "kg", icon: <FaWeight /> },
    { label: "Temp", value: "98.6", unit: "°F", icon: <FaThermometerHalf /> },
  ];

  return (
    <div className="vitals-card glass-card">
      <div className="card-header-mini">
        <h3>Vitals Snapshot</h3>
      </div>
      <div className="vitals-grid">
        {vitals.map((v, i) => (
          <div key={i} className="vital-item">
            <div className="vital-icon">{v.icon}</div>
            <div className="vital-data">
              <span className="vital-label">{v.label}</span>
              <strong>{v.value} <small>{v.unit}</small></strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitalsQuickView;
