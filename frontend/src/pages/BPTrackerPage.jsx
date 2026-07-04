import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRecommendations } from "../context/RecommendationContext";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat, FaInfoCircle, FaArrowLeft, FaSave, FaChartLine, FaTint, FaClock, FaHistory
} from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./PremiumContent.css";
import { PremiumHeroBanner, PremiumCard } from "../components/PremiumUI";

const BPTrackerPage = () => {
  const { getRecommendations, latestAssessment } = useRecommendations();
  const navigate = useNavigate();
  const recommendations = getRecommendations();
  
  const [form, setForm] = useState({ systolic: "", diastolic: "", heartRate: "", notes: "" });

  if (!recommendations || !latestAssessment) {
    return (
      <div className="premium-page-container">
        <div className="empty-state glass-card">
          <FaInfoCircle />
          <h2>No Active Assessment Found</h2>
          <p>Complete a health assessment to view your personalized cardiovascular monitoring plan.</p>
          <button className="btn-premium btn-primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const { bpFrequency } = recommendations;
  const { diseaseType, risk_level } = latestAssessment;

  const bpData = [
    { day: "Mon", sys: 120, dia: 80 },
    { day: "Tue", sys: 122, dia: 82 },
    { day: "Wed", sys: 118, dia: 78 },
    { day: "Thu", sys: 125, dia: 85 },
    { day: "Fri", sys: 121, dia: 81 },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    // Logic to save reading
    setForm({ systolic: "", diastolic: "", heartRate: "", notes: "" });
  };

  return (
    <div className="premium-page-container">
      <PremiumHeroBanner 
        eyebrow="Cardiovascular Intelligence"
        title="Blood Pressure Tracker"
        description={`Current Status: Stable | Monitoring: ${bpFrequency}`}
        icon={<FaHeartbeat />}
      />

      <div className="premium-grid-layout">
        {/* Overview */}
        <div className="glass-card stat-card">
          <div className="stat-icon"><FaTint /></div>
          <div className="stat-info"><span>Systolic</span><strong>120 mmHg</strong></div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><FaTint /></div>
          <div className="stat-info"><span>Diastolic</span><strong>80 mmHg</strong></div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><FaHeartbeat /></div>
          <div className="stat-info"><span>Heart Rate</span><strong>72 BPM</strong></div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-info"><span>Last Updated</span><strong>Today</strong></div>
        </div>

        {/* Analytics & Entry */}
        <PremiumCard title="BP Trend Analytics" icon={<FaChartLine />}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="sys" stroke="#0ea5e9" strokeWidth={3} />
                <Line type="monotone" dataKey="dia" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        <PremiumCard title="Add New Reading" icon={<FaHistory />}>
          <form onSubmit={handleSave} className="bp-form">
            <input placeholder="Systolic (mmHg)" value={form.systolic} onChange={(e) => setForm({...form, systolic: e.target.value})} />
            <input placeholder="Diastolic (mmHg)" value={form.diastolic} onChange={(e) => setForm({...form, diastolic: e.target.value})} />
            <input placeholder="Heart Rate (BPM)" value={form.heartRate} onChange={(e) => setForm({...form, heartRate: e.target.value})} />
            <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
            <button className="btn-premium btn-primary"><FaSave /> Save Reading</button>
          </form>
        </PremiumCard>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button className="btn-premium btn-outline" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BPTrackerPage;
