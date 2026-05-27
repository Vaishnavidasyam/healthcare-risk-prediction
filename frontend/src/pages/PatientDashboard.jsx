// frontend/src/pages/PatientDashboard.jsx

import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import PredictHeart from "../components/PredictHeart";
import PredictDiabetes from "../components/PredictDiabetes";
import PredictKidney from "../components/PredictKidney";

import HealthCard from "../components/HealthCard";

import AnalyticsPage from "./AnalyticsPage";
import ReportsPage from "./ReportsPage";
import RecommendationsPage from "./RecommendationsPage";
import SettingsPage from "./SettingsPage";

import api from "../api/client";

import {
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaShieldAlt,
  FaBrain,
  FaCheckCircle,
  FaArrowUp,
} from "react-icons/fa";

import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [active, setActive] = useState("overview");

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyRes = await api.get("/history");

        setHistory(historyRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latestHeart = history.find((item) => item.disease === "heart");

  const latestDiabetes = history.find((item) => item.disease === "diabetes");

  const latestKidney = history.find((item) => item.disease === "kidney");

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>

        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}

      <Sidebar
        active={active}
        onSelect={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN */}

      <main className={`dashboard-main ${collapsed ? "main-expanded" : ""}`}>
        {/* ======================================================
            OVERVIEW
        ====================================================== */}

        {active === "overview" && (
          <>
            {/* HEADER */}

            <div className="dashboard-header">
              <div>
                <div className="dashboard-badge">
                  <FaBrain />
                  AI Healthcare Intelligence
                </div>

                <h1>Patient Dashboard</h1>

                <p>
                  Monitor healthcare insights, wellness, disease predictions,
                  and AI-powered recommendations.
                </p>
              </div>

              <div className="dashboard-status">
                <FaCheckCircle />
                System Active
              </div>
            </div>

            {/* HEALTH CARDS */}

            <div className="overview-cards">
              <HealthCard
                title="Heart Risk"
                level={latestHeart?.risk_level || "Unknown"}
                percentage={latestHeart?.risk_percentage || 0}
                description="AI cardiovascular monitoring and prediction."
              />

              <HealthCard
                title="Diabetes Risk"
                level={latestDiabetes?.risk_level || "Unknown"}
                percentage={latestDiabetes?.risk_percentage || 0}
                description="Glucose and diabetes prediction analytics."
              />

              <HealthCard
                title="Kidney Risk"
                level={latestKidney?.risk_level || "Unknown"}
                percentage={latestKidney?.risk_percentage || 0}
                description="Kidney health screening and monitoring."
              />
            </div>

            {/* GRID */}

            <div className="dashboard-grid">
              {/* LEFT */}

              <div className="dashboard-left">
                {/* HEALTH SUMMARY */}

                <div className="health-summary-card">
                  <div className="card-header">
                    <div>
                      <h3>Today's Health Summary</h3>

                      <p className="summary-subtitle">
                        Personalized wellness overview powered by AI monitoring.
                      </p>
                    </div>

                    <div className="summary-badge">Healthy</div>
                  </div>

                  {/* SUMMARY GRID */}

                  <div className="summary-grid">
                    <div className="summary-box">
                      <div className="summary-icon blue-bg">
                        <FaHeartbeat />
                      </div>

                      <div>
                        <h4>Heart Condition</h4>

                        <span>Stable</span>
                      </div>
                    </div>

                    <div className="summary-box">
                      <div className="summary-icon green-bg">
                        <FaTint />
                      </div>

                      <div>
                        <h4>Glucose Level</h4>

                        <span>Normal</span>
                      </div>
                    </div>

                    <div className="summary-box">
                      <div className="summary-icon red-bg">
                        <FaNotesMedical />
                      </div>

                      <div>
                        <h4>Kidney Health</h4>

                        <span>Good</span>
                      </div>
                    </div>
                  </div>

                  {/* TRACKERS */}

                  <div className="daily-tracker">
                    <div className="tracker-item">
                      <div className="tracker-top">
                        <span>Daily Water Intake</span>

                        <strong>72%</strong>
                      </div>

                      <div className="tracker-bar">
                        <div
                          className="tracker-fill blue-fill"
                          style={{
                            width: "72%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="tracker-item">
                      <div className="tracker-top">
                        <span>Physical Activity</span>

                        <strong>81%</strong>
                      </div>

                      <div className="tracker-bar">
                        <div
                          className="tracker-fill green-fill"
                          style={{
                            width: "81%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="tracker-item">
                      <div className="tracker-top">
                        <span>Sleep Quality</span>

                        <strong>68%</strong>
                      </div>

                      <div className="tracker-bar">
                        <div
                          className="tracker-fill red-fill"
                          style={{
                            width: "68%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INSIGHTS */}

                <div className="simple-card">
                  <div className="card-header">
                    <h3>AI Health Insights</h3>

                    <span>Live</span>
                  </div>

                  <div className="insight-list">
                    <div className="insight-item">
                      <div className="insight-dot blue"></div>

                      <div>
                        <strong>Cardiovascular Health</strong>

                        <p>
                          Maintain daily exercise and monitor blood pressure
                          regularly.
                        </p>
                      </div>
                    </div>

                    <div className="insight-item">
                      <div className="insight-dot green"></div>

                      <div>
                        <strong>Diabetes Prevention</strong>

                        <p>
                          Reduce sugar intake and maintain balanced nutrition
                          habits.
                        </p>
                      </div>
                    </div>

                    <div className="insight-item">
                      <div className="insight-dot red"></div>

                      <div>
                        <strong>Kidney Wellness</strong>

                        <p>
                          Maintain hydration and healthy sleep routines
                          consistently.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="dashboard-right">
                {/* SCORE */}

                <div className="score-card">
                  <span className="score-label">Overall Health Score</span>

                  <h2>84%</h2>

                  <div className="score-progress">
                    <div
                      className="score-fill"
                      style={{
                        width: "84%",
                      }}
                    ></div>
                  </div>

                  <p>
                    Your health indicators currently appear balanced and stable.
                  </p>
                </div>

                {/* RECOMMENDATIONS */}

                <div className="simple-card">
                  <div className="card-header">
                    <h3>Recommendations</h3>

                    <FaArrowUp />
                  </div>

                  <div className="recommendation-list">
                    <div className="recommendation-item">
                      <FaHeartbeat />

                      <span>Exercise 30 mins daily</span>
                    </div>

                    <div className="recommendation-item">
                      <FaTint />

                      <span>Monitor glucose regularly</span>
                    </div>

                    <div className="recommendation-item">
                      <FaNotesMedical />

                      <span>Schedule routine health checkups</span>
                    </div>
                  </div>
                </div>

                {/* SECURITY */}

                <div className="simple-card">
                  <div className="card-header">
                    <h3>Healthcare Security</h3>

                    <FaShieldAlt />
                  </div>

                  <div className="security-box">
                    <div className="security-status"></div>

                    <div>
                      <strong>Your healthcare data is protected</strong>

                      <p>
                        AI systems and medical reports are securely encrypted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* HEART */}

        {active === "heart" && <PredictHeart />}

        {/* DIABETES */}

        {active === "diabetes" && <PredictDiabetes />}

        {/* KIDNEY */}

        {active === "kidney" && <PredictKidney />}

        {/* ANALYTICS */}

        {active === "analytics" && <AnalyticsPage />}

        {/* REPORTS */}

        {active === "reports" && <ReportsPage />}

        {/* RECOMMENDATIONS */}

        {active === "recommendations" && <RecommendationsPage />}

        {/* SETTINGS */}

        {active === "settings" && <SettingsPage />}
      </main>
    </div>
  );
};

export default PatientDashboard;
