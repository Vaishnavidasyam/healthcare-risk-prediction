import React, { useState, useEffect } from "react";
import {
  FaUtensils,
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarPlus,
  FaFilePdf,
  FaShoppingCart,
  FaLightbulb,
  FaUserMd,
  FaChevronRight,
  FaAppleAlt,
  FaRunning,
  FaCapsules
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/client";
import { toast } from "react-hot-toast";

import "./RecommendationsPage.css";

const RecommendationsPage = () => {
  const [activeTab, setActiveTab] = useState("diet");
  const [dietPlan, setDietPlan] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState("heart");

  useEffect(() => {
    fetchInitialData();
  }, [selectedDisease]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [dietRes, doctorRes] = await Promise.all([
        api.post("/premium/diet/plan", { disease_type: selectedDisease }),
        api.post("/premium/doctors/recommendations", { conditions: [selectedDisease], health_score: 65 })
      ]);
      setDietPlan(dietRes.data.data.plan);
      setSpecialists(doctorRes.data.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading("Generating clinical case study...");
      const summaryRes = await api.get("/health/dashboard-summary");
      const res = await api.post("/premium/report/generate", {
        health_score: summaryRes.data.health_score,
        predictions: { heart: 0.65, diabetes: 0.22, kidney: 0.15 },
        recommendations: summaryRes.data.top_recommendations
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Health_Intelligence_Assessment.pdf');
      document.body.appendChild(link);
      link.click();
      toast.dismiss();
      toast.success("Assessment exported successfully.");
    } catch (err) {
      toast.dismiss();
      toast.error("PDF generation failed.");
    }
  };

  if (loading && !dietPlan) {
    return (
      <div className="rec-loading-premium">
        <div className="loader-ring"></div>
        <h2>Curating <span>Personalized Plan</span></h2>
      </div>
    );
  }

  return (
    <div className="recommendations-enterprise-page">
      {/* HEADER */}
      <header className="rec-header-premium">
        <div className="header-left">
          <div className="rec-badge-enterprise">
            <FaAppleAlt /> <span>Precision Lifestyle Guidance</span>
          </div>
          <h1>Clinical <span>Health Planner</span></h1>
          <p>Personalized nutrition, specialist referrals, and lifestyle protocols based on your AI risk profile.</p>
        </div>
        
        <div className="header-right">
          <button className="btn-premium btn-primary" onClick={handleDownloadPDF}>
            <FaFilePdf /> Export Health Report
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="rec-tabs-premium glass-card">
        <button className={activeTab === "diet" ? "active" : ""} onClick={() => setActiveTab("diet")}>
          <FaUtensils /> AI Diet Protocol
        </button>
        <button className={activeTab === "specialists" ? "active" : ""} onClick={() => setActiveTab("specialists")}>
          <FaUserMd /> Specialist Referrals
        </button>
        <button className={activeTab === "lifestyle" ? "active" : ""} onClick={() => setActiveTab("lifestyle")}>
          <FaRunning /> Lifestyle Protocol
        </button>
      </div>

      <div className="rec-viewport-premium">
        <AnimatePresence mode="wait">
          {activeTab === "diet" && (
            <motion.div 
              key="diet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="diet-planner-layout"
            >
              <div className="diet-controls-bar glass-card">
                <div className="focus-group">
                  <span>Clinical Focus:</span>
                  <select value={selectedDisease} onChange={(e) => setSelectedDisease(e.target.value)}>
                    <option value="heart">Cardiovascular Health</option>
                    <option value="diabetes">Metabolic Management</option>
                    <option value="kidney">Renal Protection</option>
                  </select>
                </div>
                <div className="ai-protocol-badge"><FaCheckCircle /> Evidence-Based Protocol v2.4</div>
              </div>

              <div className="diet-content-grid">
                {/* MEALS */}
                <div className="diet-card-main glass-card">
                  <div className="card-header-flex">
                    <h3><FaCalendarPlus /> Weekly Meal Sequence</h3>
                  </div>
                  <div className="meals-sequence-list">
                    {Object.entries(dietPlan?.weekly_meals || {}).map(([cat, meals]) => (
                      <div key={cat} className="meal-cat-block">
                        <h4>{cat}</h4>
                        <div className="meal-items-flex">
                          {meals.map((m, i) => <div key={i} className="meal-tag">{m}</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SIDEBAR RECS */}
                <div className="diet-side-column">
                  <div className="side-rec-card glass-card shopping">
                    <h3><FaShoppingCart /> Clinical Grocery List</h3>
                    <div className="shopping-grid-premium">
                      {Object.entries(dietPlan?.shopping_list || {}).map(([c, items]) => (
                        <div key={c} className="shop-item-mini">
                          <strong>{c}</strong>
                          <p>{items.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="side-rec-card glass-card avoid">
                    <h3><FaExclamationTriangle /> High-Risk Constraints</h3>
                    <div className="avoid-stack">
                      {dietPlan?.foods_to_avoid?.map((f, i) => (
                        <div key={i} className="avoid-pill"><FaCheckCircle /> {f}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "specialists" && (
            <motion.div 
              key="specialists"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="specialists-layout-premium"
            >
              <div className="specialists-grid-premium">
                {specialists.map((s, i) => (
                  <div key={i} className="doctor-card-premium glass-card">
                    <div className="doc-avatar-box">
                      <FaUserMd />
                      <div className="doc-verified"><FaCheckCircle /></div>
                    </div>
                    <div className="doc-info-premium">
                      <span className={`urgency-label ${s.urgency?.toLowerCase()}`}>{s.urgency} Priority</span>
                      <h3>{s.specialist}</h3>
                      <p className="doc-desc">{s.description}</p>
                      <div className="doc-reason-box">
                        <strong>Protocol Reason:</strong>
                        <p>{s.reason}</p>
                      </div>
                      <button className="btn-premium btn-primary full-width">Initialize Consultation</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecommendationsPage;
