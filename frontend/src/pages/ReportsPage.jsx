// frontend/src/pages/ReportsPage.jsx

import React from "react";

import {
  FaFileMedical,
  FaDownload,
  FaFilePdf,
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaCloudDownloadAlt,
  FaShieldAlt,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

import "./ReportsPage.css";

const ReportsPage = () => {
  // =========================================
  // BUTTON FUNCTIONS
  // =========================================

  const handleAssessment = () => {
    alert("AI Healthcare Assessment Generated Successfully");
  };

  const handlePDF = () => {
    alert("Medical PDF Export Started");
  };

  const handleAnalytics = () => {
    alert("Analytics Download Started");
  };

  const handleOpenReport = (name) => {
    alert(`${name} Opened Successfully`);
  };

  return (
    <div className="reports-page">
      {/* HERO */}

      <div className="reports-hero">
        <div className="reports-hero-left">
          <div className="reports-badge">
            <FaFileMedical />
            <span>AI Medical Reports</span>
          </div>

          <h1>
            Smart Healthcare <span>Reports Center</span>
          </h1>

          <p>
            Access AI-generated healthcare assessments, disease prediction
            reports, downloadable PDFs, and advanced medical summaries.
          </p>

          <div className="reports-stats">
            <div className="reports-stat-card">
              <h2>120+</h2>
              <span>Generated Reports</span>
            </div>

            <div className="reports-stat-card">
              <h2>99%</h2>
              <span>Prediction Accuracy</span>
            </div>

            <div className="reports-stat-card">
              <h2>24/7</h2>
              <span>AI Monitoring</span>
            </div>
          </div>
        </div>

        <div className="reports-hero-right">
          <div className="reports-glass-card">
            <FaChartLine />

            <h3>AI Reporting Engine</h3>

            <p>Healthcare report generation system is active.</p>

            <div className="reports-live-status">
              <span></span>
              Live Sync
            </div>
          </div>
        </div>
      </div>

      {/* REPORT GRID */}

      <div className="reports-grid">
        {/* CARD 1 */}

        <div className="report-card">
          <div className="report-icon report-blue">
            <FaHeartbeat />
          </div>

          <h3>Prediction Reports</h3>

          <p>
            Download AI-generated disease prediction summaries and risk analysis
            reports.
          </p>

          <div className="report-features">
            <span>
              <FaCheckCircle />
              Heart Risk Summary
            </span>

            <span>
              <FaCheckCircle />
              Diabetes Analytics
            </span>

            <span>
              <FaCheckCircle />
              Kidney Risk Insights
            </span>
          </div>

          <button className="report-btn" onClick={handleAssessment}>
            <FaDownload />
            Generate Assessment
          </button>
        </div>

        {/* CARD 2 */}

        <div className="report-card">
          <div className="report-icon report-red">
            <FaFilePdf />
          </div>

          <h3>Medical PDF Reports</h3>

          <p>
            Generate professional PDF healthcare reports with AI analytics and
            prediction insights.
          </p>

          <div className="report-features">
            <span>
              <FaCheckCircle />
              AI Medical Summary
            </span>

            <span>
              <FaCheckCircle />
              Risk Charts & Insights
            </span>

            <span>
              <FaCheckCircle />
              Doctor Friendly Format
            </span>
          </div>

          <button className="report-btn" onClick={handlePDF}>
            <FaFilePdf />
            Export Medical PDF
          </button>
        </div>

        {/* CARD 3 */}

        <div className="report-card">
          <div className="report-icon report-green">
            <FaCloudDownloadAlt />
          </div>

          <h3>Export Analytics</h3>

          <p>
            Export healthcare monitoring history and prediction analytics
            securely.
          </p>

          <div className="report-features">
            <span>
              <FaCheckCircle />
              CSV Export
            </span>

            <span>
              <FaCheckCircle />
              Historical Predictions
            </span>

            <span>
              <FaCheckCircle />
              AI Risk Tracking
            </span>
          </div>

          <button className="report-btn" onClick={handleAnalytics}>
            <FaDownload />
            Download Analytics
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION */}

      <div className="reports-bottom-grid">
        {/* RECENT REPORTS */}

        <div className="reports-info-card">
          <div className="reports-info-header">
            <FaFileMedical />

            <h3>Recent Generated Reports</h3>
          </div>

          <div className="recent-reports-list">
            <div className="recent-report-item">
              <div className="recent-report-icon">
                <FaHeartbeat />
              </div>

              <div>
                <h4>Heart Disease Assessment</h4>
                <p>Generated 2 hours ago</p>
              </div>

              <button onClick={() => handleOpenReport("Heart Disease Report")}>
                Open Report
              </button>
            </div>

            <div className="recent-report-item">
              <div className="recent-report-icon">
                <FaTint />
              </div>

              <div>
                <h4>Diabetes Risk Analytics</h4>
                <p>Generated yesterday</p>
              </div>

              <button onClick={() => handleOpenReport("Diabetes Report")}>
                Open Report
              </button>
            </div>

            <div className="recent-report-item">
              <div className="recent-report-icon">
                <FaNotesMedical />
              </div>

              <div>
                <h4>Kidney Monitoring Report</h4>
                <p>Generated 3 days ago</p>
              </div>

              <button onClick={() => handleOpenReport("Kidney Report")}>
                Open Report
              </button>
            </div>
          </div>
        </div>

        {/* SECURITY */}

        <div className="reports-info-card">
          <div className="reports-info-header">
            <FaShieldAlt />

            <h3>Security & Privacy</h3>
          </div>

          <div className="security-section">
            <div className="security-box">
              <h4>Encrypted Healthcare Data</h4>

              <p>
                Your healthcare reports and prediction data are securely
                encrypted and protected.
              </p>
            </div>

            <div className="security-box">
              <h4>AI Data Protection</h4>

              <p>
                AI-generated analytics remain private and accessible only to
                authenticated users.
              </p>
            </div>

            <div className="security-status">
              <span></span>
              System Protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
