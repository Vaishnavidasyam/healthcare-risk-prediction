// frontend/src/pages/AnalyticsPage.jsx

import React from "react";

import {
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaBrain,
  FaShieldAlt,
  FaWaveSquare,
  FaUserMd,
  FaChartBar,
  FaCheckCircle,
} from "react-icons/fa";

import "./AnalyticsPage.css";

const AnalyticsPage = () => {
  return (
    <div className="analytics-page">
      {/* =========================================
          HERO SECTION
      ========================================= */}

      <div className="analytics-hero">
        <div className="analytics-hero-content">
          <div className="analytics-badge">
            <FaBrain />
            <span>AI Healthcare Intelligence</span>
          </div>

          <h1>
            Advanced Healthcare <span>Analytics Dashboard</span>
          </h1>

          <p>
            Real-time AI-powered healthcare monitoring platform with predictive
            disease analytics, intelligent insights, and advanced patient risk
            tracking.
          </p>

          <div className="analytics-hero-stats">
            <div className="hero-stat-card">
              <h2>98%</h2>
              <span>Prediction Accuracy</span>
            </div>

            <div className="hero-stat-card">
              <h2>24/7</h2>
              <span>AI Monitoring</span>
            </div>

            <div className="hero-stat-card">
              <h2>3+</h2>
              <span>Disease Models</span>
            </div>
          </div>
        </div>

        <div className="analytics-hero-visual">
          <div className="pulse-circle"></div>

          <div className="analytics-glass-card">
            <FaWaveSquare />

            <h3>AI Health Engine</h3>

            <p>Real-time prediction monitoring active.</p>

            <div className="analytics-live-indicator">
              <span></span>
              Live Monitoring
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ANALYTICS GRID
      ========================================= */}

      <div className="analytics-grid">
        {/* HEART */}
        <div className="premium-analytics-card heart">
          <div className="card-top">
            <div className="analytics-icon">
              <FaHeartbeat />
            </div>

            <div className="risk-badge high">
              <FaArrowUp />
              High Activity
            </div>
          </div>

          <h3>Heart Risk Analytics</h3>

          <p>
            Advanced cardiovascular monitoring and AI-powered heart disease
            trend analysis.
          </p>

          <div className="analytics-progress-section">
            <div className="progress-header">
              <span>Monitoring Accuracy</span>
              <span>96%</span>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill heart-fill"
                style={{ width: "96%" }}
              ></div>
            </div>
          </div>

          <div className="analytics-footer">
            <span>+18% improved detection</span>
          </div>
        </div>

        {/* DIABETES */}
        <div className="premium-analytics-card diabetes">
          <div className="card-top">
            <div className="analytics-icon">
              <FaTint />
            </div>

            <div className="risk-badge medium">
              <FaArrowDown />
              Stable
            </div>
          </div>

          <h3>Diabetes Monitoring</h3>

          <p>
            Smart glucose tracking and AI-based diabetes progression analytics.
          </p>

          <div className="analytics-progress-section">
            <div className="progress-header">
              <span>Prediction Accuracy</span>
              <span>92%</span>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill diabetes-fill"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>

          <div className="analytics-footer">
            <span>Real-time glucose insights</span>
          </div>
        </div>

        {/* KIDNEY */}
        <div className="premium-analytics-card kidney">
          <div className="card-top">
            <div className="analytics-icon">
              <FaNotesMedical />
            </div>

            <div className="risk-badge low">
              <FaCheckCircle />
              Protected
            </div>
          </div>

          <h3>Kidney Analytics</h3>

          <p>
            AI-assisted kidney disease screening and chronic condition
            monitoring.
          </p>

          <div className="analytics-progress-section">
            <div className="progress-header">
              <span>Screening Efficiency</span>
              <span>94%</span>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill kidney-fill"
                style={{ width: "94%" }}
              ></div>
            </div>
          </div>

          <div className="analytics-footer">
            <span>Early-stage detection enabled</span>
          </div>
        </div>

        {/* AI */}
        <div className="premium-analytics-card ai">
          <div className="card-top">
            <div className="analytics-icon">
              <FaChartLine />
            </div>

            <div className="risk-badge ai-badge">
              <FaBrain />
              AI Active
            </div>
          </div>

          <h3>AI Health Intelligence</h3>

          <p>
            Unified healthcare analytics engine with predictive AI intelligence
            system.
          </p>

          <div className="analytics-progress-section">
            <div className="progress-header">
              <span>System Intelligence</span>
              <span>99%</span>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill ai-fill"
                style={{ width: "99%" }}
              ></div>
            </div>
          </div>

          <div className="analytics-footer">
            <span>Neural healthcare insights enabled</span>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM SECTION
      ========================================= */}

      <div className="analytics-bottom-grid">
        {/* RECOMMENDATIONS */}
        <div className="analytics-info-card">
          <div className="info-header">
            <FaUserMd />

            <h3>AI Healthcare Recommendations</h3>
          </div>

          <div className="recommendation-list">
            <div className="recommendation-item">
              <div className="recommendation-icon">
                <FaHeartbeat />
              </div>

              <p>
                Maintain regular cardiovascular exercise and monitor blood
                pressure levels consistently.
              </p>
            </div>

            <div className="recommendation-item">
              <div className="recommendation-icon">
                <FaTint />
              </div>

              <p>
                Reduce sugar intake and track glucose fluctuations using smart
                monitoring tools.
              </p>
            </div>

            <div className="recommendation-item">
              <div className="recommendation-icon">
                <FaNotesMedical />
              </div>

              <p>
                Schedule routine kidney screenings and maintain hydration
                balance.
              </p>
            </div>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="analytics-info-card">
          <div className="info-header">
            <FaShieldAlt />

            <h3>AI System Status</h3>
          </div>

          <div className="system-status-list">
            <div className="system-status-item">
              <span>Heart AI Model</span>

              <div className="status-active">
                <span></span>
                Active
              </div>
            </div>

            <div className="system-status-item">
              <span>Diabetes AI Engine</span>

              <div className="status-active">
                <span></span>
                Active
              </div>
            </div>

            <div className="system-status-item">
              <span>Kidney Risk Detection</span>

              <div className="status-active">
                <span></span>
                Active
              </div>
            </div>

            <div className="system-status-item">
              <span>Real-time Monitoring</span>

              <div className="status-active">
                <span></span>
                Enabled
              </div>
            </div>
          </div>

          <div className="analytics-system-score">
            <FaChartBar />

            <div>
              <h2>99.8%</h2>
              <p>System Stability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
