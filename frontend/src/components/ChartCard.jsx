// frontend/src/components/ChartCard.jsx

import React from "react";

import { FaChartLine, FaArrowUp } from "react-icons/fa";

import "./ChartCard.css";

const ChartCard = ({ title, subtitle, children, trend }) => {
  return (
    <div className="chart-card">
      {/* TOP */}
      <div className="chart-card-header">
        <div>
          <h4>{title}</h4>

          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>

        <div className="chart-icon-wrapper">
          <FaChartLine />
        </div>
      </div>

      {/* TREND */}
      {trend && (
        <div className="chart-trend">
          <FaArrowUp />

          <span>{trend}</span>
        </div>
      )}

      {/* BODY */}
      <div className="chart-card-body">{children}</div>
    </div>
  );
};

export default ChartCard;
