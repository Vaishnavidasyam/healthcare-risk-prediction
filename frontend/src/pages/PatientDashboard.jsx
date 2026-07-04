import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import HealthScore from "../components/HealthScore";
import PredictHeart from "../components/PredictHeart";
import PredictDiabetes from "../components/PredictDiabetes";
import PredictKidney from "../components/PredictKidney";
import HealthTimeline from "../components/HealthTimeline";
import EmergencyAlert from "../components/EmergencyAlert";

import api from "../api/client";
import {
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaBrain,
  FaCheckCircle,
  FaHistory,
  FaFileMedical,
  FaExclamationTriangle,
  FaRobot,
  FaChevronRight,
  FaSync,
  FaShieldAlt,
  FaStethoscope,
  FaClipboardCheck,
  FaArrowRight,
} from "react-icons/fa";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const location = useLocation();
  const getActiveTabFromPath = () => {
    if (location.pathname.includes("/heart")) return "heart";
    if (location.pathname.includes("/diabetes")) return "diabetes";
    if (location.pathname.includes("/kidney")) return "kidney";
    return "overview";
  };
  
  const [active, setActive] = useState(getActiveTabFromPath());
  const navigate = useNavigate();

  useEffect(() => {
    setActive(getActiveTabFromPath());
  }, [location.pathname]);

  const setActiveTab = (tabName) => {
    setActive(tabName);
    navigate(tabName === "overview" ? "/dashboard" : `/${tabName}`);
  };

  const [history, setHistory] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const refreshDashboard = async () => {
    setSyncing(true);
    setLoadError("");
    
    // Mock data for dashboard
    const historyData = [
      { disease: 'heart', risk_level: 'Low' },
      { disease: 'diabetes', risk_level: 'Low' },
      { disease: 'kidney', risk_level: 'Low' }
    ];

    const summaryData = {
      health_score: { overall_score: 88, overall_category: 'Excellent' },
      predictions_count: 3,
      reports_count: 5,
      recent_events: [
        { event_type: 'assessment', event_date: new Date().toISOString(), title: 'Cardiac Assessment', description: 'Risk level: Low - Normal' },
        { event_type: 'report', event_date: new Date().toISOString(), title: 'Blood Report Analysis', description: 'Metabolic markers within normal range.' },
        { event_type: 'assessment', event_date: new Date().toISOString(), title: 'Renal Function Test', description: 'Risk level: Low - Normal' }
      ],
      top_recommendations: [
        { title: 'Maintain current activity levels' },
        { title: 'Stay hydrated - recommended 2L daily' },
        { title: 'Balanced intake of fiber-rich foods' }
      ]
    };

    const scoreHistoryData = [
      { score_date: '2026-05-20', overall_score: 82 },
      { score_date: '2026-05-27', overall_score: 85 },
      { score_date: '2026-06-03', overall_score: 88 }
    ];

    setHistory(historyData);
    setDashboardData(summaryData);
    setScoreHistory(scoreHistoryData);
    setSyncing(false);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await refreshDashboard();
      setLoading(false);
    };
    initData();
  }, []);

  const latestHeart = history.find((item) => item.disease === "heart");
  const latestDiabetes = history.find((item) => item.disease === "diabetes");
  const latestKidney = history.find((item) => item.disease === "kidney");

  const latestHealthScore = dashboardData?.health_score?.overall_score ?? 0;
  const scoreCategory = dashboardData?.health_score?.overall_category || "N/A";
  const predictionsCount = dashboardData?.predictions_count || history.length || 0;
  const reportsCount = dashboardData?.reports_count || 0;
  
  const scoreHistoryLatest =
    scoreHistory[scoreHistory.length - 1]?.overall_score;
  const scoreHistoryPrevious =
    scoreHistory[scoreHistory.length - 2]?.overall_score;
  const healthTrend =
    scoreHistoryLatest != null && scoreHistoryPrevious != null
      ? Math.round(scoreHistoryLatest - scoreHistoryPrevious)
      : 0;

  const chartData = scoreHistory.map((item) => ({
    date: new Date(item.score_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: item.overall_score,
  }));

  const recentEvents = dashboardData?.recent_events || [];
  const topRecommendations = dashboardData?.top_recommendations || [];
  const completedAssessments = [latestHeart, latestDiabetes, latestKidney].filter(Boolean).length;
  
  const assessments = [
    { key: "heart", label: "Cardiac", icon: <FaHeartbeat />, result: latestHeart?.risk_level, className: "heart" },
    { key: "diabetes", label: "Metabolic", icon: <FaTint />, result: latestDiabetes?.risk_level, className: "diabetes" },
    { key: "kidney", label: "Renal", icon: <FaNotesMedical />, result: latestKidney?.risk_level, className: "kidney" },
  ];
  const starterRecommendations = [
    "Complete your first health risk assessment",
    "Upload a recent clinical report for AI analysis",
    "Review your generated health plan",
  ];

  if (loading) {
    return (
      <div className="dashboard-loading-enterprise">
        <div className="loader-ring"></div>
        <h2>SmartMed <span>Intelligence</span></h2>
        <p>Securing encrypted health data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-enterprise-page">
      <AnimatePresence mode="wait">
        {active === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="dashboard-content"
          >
            <div className="dashboard-welcome">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1>Clinical <span>Command Center</span></h1>
                <p>Welcome back, {(user?.name || "").split(" ")[0] || "User"}. Your health intelligence is up to date.</p>
              </motion.div>
              <motion.div 
                className="welcome-actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="system-status-chip">
                  <span className="pulse-dot"></span> AI Inference: Optimal
                </div>
                <button className="btn-premium btn-outline" onClick={refreshDashboard} disabled={syncing}>
                  <FaSync className={syncing ? "spin-icon" : ""} /> {syncing ? "Syncing..." : "Sync Data"}
                </button>
              </motion.div>
            </div>

            {loadError && <div className="dashboard-notice animate-shake">{loadError}</div>}

            <div className="kpi-grid-enterprise">
              <motion.div 
                className="kpi-card-main glass-card"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="card-header-mini">
                  <h3>Smart Health Score</h3>
                  <div className={`trend-badge ${healthTrend >= 0 ? 'positive' : 'negative'}`}>
                    {healthTrend >= 0 ? <FaArrowRight style={{ transform: 'rotate(-45deg)', marginRight: '4px' }} /> : <FaArrowRight style={{ transform: 'rotate(45deg)', marginRight: '4px' }} />}
                    {healthTrend > 0 ? `+${healthTrend}%` : `${healthTrend}%`}
                  </div>
                </div>

                <HealthScore
                  score={latestHealthScore}
                  category={scoreCategory}
                  trend={healthTrend}
                  size="small"
                  hasData={true}
                  showGrade={true}
                  className="health-score-embedded"
                />

                <div className="score-support-line">
                  <p>Holistic health index calculated from longitudinal clinical data and AI risk models.</p>
                  <button className="btn-text" onClick={() => navigate("/analytics")}>
                    Detailed Analysis <FaChevronRight />
                  </button>
                </div>
              </motion.div>

              <motion.div 
                className="kpi-card-secondary glass-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="card-header-mini"><h3>Risk Assessments</h3></div>
                <div className="risk-mini-list">
                  {assessments.map((assessment, index) => (
                    <motion.button 
                      className="risk-mini-item" 
                      key={assessment.key} 
                      onClick={() => navigate(`/${assessment.key}`)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`risk-icon ${assessment.className}`}>{assessment.icon}</div>
                      <div className="risk-info">
                        <span>{assessment.label}</span>
                        <strong>{assessment.result || "Action Required"}</strong>
                      </div>
                      <FaChevronRight className="risk-arrow" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="kpi-card-secondary glass-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="card-header-mini"><h3>Intelligence Pipeline</h3></div>
                <div className="intel-stats">
                  <div className="stat-row">
                    <span>Clinical Reports</span>
                    <strong>{reportsCount} Analyzed</strong>
                  </div>
                  <div className="stat-row">
                    <span>Model Evaluations</span>
                    <strong>{completedAssessments}/3 Validated</strong>
                  </div>
                  <div className="stat-row">
                    <span>Security Protocol</span>
                    <strong className="text-green"><FaShieldAlt style={{ marginRight: '6px' }} /> AES-256</strong>
                  </div>
                </div>
                <button className="btn-premium btn-primary full-width" onClick={() => navigate("/reports")}>
                  <FaFileMedical /> Analysis Hub
                </button>
              </motion.div>
            </div>

            <div className="dashboard-main-grid">
              <motion.div 
                className="trends-container glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="card-header-flex">
                  <h3>Biometric Evolution</h3>
                  <div className="chart-tabs">
                    <button className="active">Health Score</button>
                    <button>Vitals</button>
                  </div>
                </div>
                <div className="recharts-wrapper-premium">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorScoreDashboard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--medical-blue)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--medical-blue)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="var(--text-muted)" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false} 
                          tick={{ dy: 10 }}
                        />
                        <YAxis 
                          stroke="var(--text-muted)" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false} 
                          domain={[0, 100]} 
                          tick={{ dx: -10 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "var(--bg-secondary)", 
                            border: "1px solid var(--border-color)", 
                            borderRadius: "16px",
                            boxShadow: "var(--shadow-md)"
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="var(--medical-blue)" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorScoreDashboard)" 
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="trend-onboarding">
                      <div className="trend-onboarding-copy">
                        <h4>Initialize your health baseline</h4>
                        <p>Complete your first assessment to start tracking longitudinal health trends.</p>
                        <button className="btn-premium btn-primary" onClick={() => navigate("/heart")}>Initialize Baseline <FaArrowRight /></button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <HealthTimeline events={recentEvents} />

              <div className="dashboard-bottom-grid" style={{ gridColumn: "span 2" }}>
                <motion.div 
                  className="ai-insights-panel glass-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="panel-header">
                    <div className="ai-brand-group">
                      <FaRobot className="ai-glow-icon" /> 
                      <h3>SmartMed Cognitive Engine</h3>
                    </div>
                    <span className="live-tag">REAL-TIME</span>
                  </div>
                  <p className="clean-insight">
                    Our neural models have processed your latest clinical data. We've detected stable metabolic markers and recommend continuing your current wellness protocol. For a deep-dive explanation, consult your personal Health Copilot.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-premium btn-primary" onClick={() => navigate("/copilot")}>
                      Open Health Copilot <FaBrain />
                    </button>
                    <button className="btn-premium btn-outline" onClick={() => navigate("/analytics")}>
                      View Biometrics
                    </button>
                  </div>
                </motion.div>

                <motion.div 
                  className="recommendations-summary glass-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="panel-header">
                    <h3>Clinical Protocol</h3>
                    <div className="badge badge-success"><FaCheckCircle /> Optimized</div>
                  </div>

                  <div className="rec-mini-grid">
                    {(topRecommendations.length > 0 ? topRecommendations : starterRecommendations).slice(0, 3).map((rec, i) => (
                      <div key={i} className={`rec-mini-item-card ${topRecommendations.length === 0 ? 'starter' : ''}`}>
                        {topRecommendations.length > 0 ? <div className="rec-check"></div> : <span className="rec-number">{i + 1}</span>}
                        <span>{typeof rec === 'string' ? rec : rec.title}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-text"
                    onClick={() => navigate("/recommendations")}
                  >
                    View Comprehensive Health Plan <FaChevronRight />
                  </button>
                </motion.div>
              </div>

              {latestHealthScore < 50 && latestHealthScore > 0 && (
                <EmergencyAlert
                  severity="critical"
                  title="CRITICAL HEALTH ALERT"
                  message="Your holistic health indicators are below the critical threshold."
                  recommendedAction="Immediate clinical review is mandatory."
                  specialist="Cardiologist"
                />
              )}
            </div>
          </motion.div>
        )}

        {active === "heart" && <PredictHeart key="heart" onComplete={refreshDashboard} />}
        {active === "diabetes" && <PredictDiabetes key="diabetes" onComplete={refreshDashboard} />}
        {active === "kidney" && <PredictKidney key="kidney" onComplete={refreshDashboard} />}
      </AnimatePresence>
    </div>
  );
};

export default PatientDashboard;
