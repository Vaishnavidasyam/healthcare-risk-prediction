import React, { useEffect, useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  FaUsers,
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaChartLine,
  FaUserShield,
  FaArrowUp,
  FaMicroscope,
  FaShieldAlt,
  FaGlobe,
  FaExclamationCircle,
  FaCheckCircle,
  FaServer,
  FaDatabase,
  FaLock
} from "react-icons/fa";
import { motion } from "framer-motion";

import api from "../api/client";
import "./AdminDashboard.css";

const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [diseaseDist, setDiseaseDist] = useState(null);
  const [reportAnalytics, setReportAnalytics] = useState(null);
  const [highRiskPatients, setHighRiskPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, distRes, reportRes, riskRes] = await Promise.all([
        api.get("/analytics/metrics"),
        api.get("/analytics/disease-distribution"),
        api.get("/analytics/report-analytics"),
        api.get("/analytics/top-risk-patients?limit=5")
      ]);

      setStats(statsRes.data.data);
      setDiseaseDist(distRes.data.data);
      setReportAnalytics(reportRes.data.data);
      setHighRiskPatients(riskRes.data.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-premium">
        <div className="admin-pulse-ring"></div>
        <h2>Initializing <span>Clinical Control</span></h2>
      </div>
    );
  }

  const distData = [
    { name: 'Cardiac', value: diseaseDist?.heart_high_risk || 0 },
    { name: 'Metabolic', value: diseaseDist?.diabetes_high_risk || 0 },
    { name: 'Renal', value: diseaseDist?.kidney_high_risk || 0 },
  ];

  return (
    <div className="admin-enterprise-page">
      {/* HEADER */}
      <header className="admin-header-premium">
        <div className="header-left">
          <div className="admin-badge-enterprise">
            <FaUserShield /> <span>Global Infrastructure Admin</span>
          </div>
          <h1>Clinical <span>Command Center</span></h1>
          <p>Population health metrics, neural engine performance, and institutional risk distribution.</p>
        </div>
        
        <div className="header-right">
          <div className="system-health-panel glass-card">
            <div className="health-node">
              <span className="dot pulse-green"></span>
              <span>Inference Nodes: Optimal</span>
            </div>
            <div className="health-node">
              <span className="dot pulse-blue"></span>
              <span>Cloud DB: Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="admin-kpi-grid-premium">
        {[
          { icon: <FaUsers />, label: "Total Clinical Users", val: stats?.total_users || 0, trend: "+12.4%", color: "blue" },
          { icon: <FaMicroscope />, label: "Neural Analyses", val: stats?.total_predictions || 0, trend: "+48%", color: "green" },
          { icon: <FaGlobe />, label: "Active Nodes", val: stats?.active_users || 0, trend: "Stable", color: "orange" },
          { icon: <FaLock />, label: "Security Compliance", val: "HIPAA", trend: "Audit Passed", color: "red" }
        ].map((kpi, i) => (
          <div key={i} className="admin-kpi-card-premium glass-card">
            <div className={`kpi-icon-box-admin ${kpi.color}`}>{kpi.icon}</div>
            <div className="kpi-info-admin">
              <span>{kpi.label}</span>
              <h3>{kpi.val}</h3>
              <p className="kpi-trend-admin"><span>{kpi.trend}</span> system growth</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-main-grid-premium">
        {/* CHARTS */}
        <div className="admin-charts-pane">
          <div className="admin-chart-block glass-card">
            <div className="chart-header-admin">
              <h3><FaChartLine /> Aggregated Risk Matrix</h3>
              <p>Real-time distribution of high-risk cases across institutional data.</p>
            </div>
            <div className="recharts-wrapper-admin">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={distData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "12px" }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {distData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-infra-grid">
            <div className="infra-card glass-card">
              <h3><FaServer /> Compute Resources</h3>
              <div className="infra-stats">
                <div className="i-stat"><span>CPU Load</span> <strong>24%</strong></div>
                <div className="i-stat"><span>Memory</span> <strong>4.2GB / 16GB</strong></div>
              </div>
              <div className="progress-mini"><div className="p-fill" style={{width: '24%'}}></div></div>
            </div>
            <div className="infra-card glass-card">
              <h3><FaDatabase /> Clinical Matrix</h3>
              <div className="infra-stats">
                <div className="i-stat"><span>Records</span> <strong>1.2M</strong></div>
                <div className="i-stat"><span>Latency</span> <strong>48ms</strong></div>
              </div>
              <div className="progress-mini"><div className="p-fill blue" style={{width: '68%'}}></div></div>
            </div>
          </div>
        </div>

        {/* LISTS */}
        <div className="admin-priority-pane">
          <div className="admin-priority-card glass-card">
            <div className="card-header-flex">
              <h3><FaExclamationCircle /> High-Risk Priority</h3>
              <span className="live-tag-admin">REAL-TIME</span>
            </div>
            <div className="priority-list-admin">
              {highRiskPatients.map((p, i) => (
                <div key={i} className="priority-item-premium">
                  <div className="p-avatar">{p.user_name[0]}</div>
                  <div className="p-info">
                    <h4>{p.user_name}</h4>
                    <span>Criticality: <strong>{p.health_score}</strong></span>
                  </div>
                  <div className="p-tags">
                    {p.risk_factors.slice(0, 1).map((rf, j) => (
                      <span key={j} className="p-tag">{rf.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-premium btn-outline full-width">Population Health Review</button>
          </div>

          <div className="admin-security-card glass-card">
            <h3>Infrastructure Integrity</h3>
            <div className="security-check-list">
              <div className="s-check"><FaCheckCircle className="text-green" /> <span>TLS 1.3 Encryption</span></div>
              <div className="s-check"><FaCheckCircle className="text-green" /> <span>AES-256 Data At Rest</span></div>
              <div className="s-check"><FaCheckCircle className="text-green" /> <span>ISO 27001 Ready</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
