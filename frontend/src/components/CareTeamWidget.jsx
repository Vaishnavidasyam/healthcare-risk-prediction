// frontend/src/components/CareTeamWidget.jsx
import React from "react";
import { FaUserMd, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./CareTeamWidget.css";

const CareTeamWidget = () => {
  const doctors = [
    { name: "Dr. Priya Nair", role: "Cardiologist" },
    { name: "Dr. Alan Grant", role: "General Physician" },
  ];

  return (
    <div className="care-team-card glass-card">
      <div className="card-header-mini">
        <h3>Care Team</h3>
      </div>
      <div className="doctors-list">
        {doctors.map((doc, i) => (
          <div key={i} className="doctor-item">
            <div className="doc-avatar"><FaUserMd /></div>
            <div className="doc-info">
              <strong>{doc.name}</strong>
              <span>{doc.role}</span>
            </div>
            <div className="doc-actions">
              <button className="btn-icon"><FaPhoneAlt /></button>
              <button className="btn-icon"><FaEnvelope /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareTeamWidget;
