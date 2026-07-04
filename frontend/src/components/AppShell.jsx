import React, { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

import PatientDashboard from "../pages/PatientDashboard";
import ReportsPage from "../pages/ReportsPage";
import CopilotPage from "../pages/CopilotPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import RecommendationsPage from "../pages/RecommendationsPage";
import SettingsPage from "../pages/SettingsPage";
import AdminDashboard from "../pages/AdminDashboard";

import DietPlanPage from "../pages/DietPlanPage";
import ExerciseGuidePage from "../pages/ExerciseGuidePage";
import BPTrackerPage from "../pages/BPTrackerPage";
import SpecialistsPage from "../pages/SpecialistsPage";

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const activeKey = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/heart")) return "heart";
    if (path.includes("/diabetes")) return "diabetes";
    if (path.includes("/kidney")) return "kidney";
    if (path.includes("/copilot")) return "copilot";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/recommendations")) return "recommendations";
    return "overview";
  }, [location.pathname]);

  const onSelect = (key) => {
    switch (key) {
      case "overview": navigate("/dashboard"); break;
      case "copilot": navigate("/copilot"); break;
      case "reports": navigate("/reports"); break;
      case "analytics": navigate("/analytics"); break;
      case "settings": navigate("/settings"); break;
      case "heart": navigate("/heart"); break;
      case "diabetes": navigate("/diabetes"); break;
      case "kidney": navigate("/kidney"); break;
      case "recommendations": navigate("/recommendations"); break;
      default: navigate("/dashboard");
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <>
      <div className={`enterprise-sidebar-wrapper ${mobileOpen ? "mobile-open" : ""}`}>
        <Sidebar
          active={activeKey}
          onSelect={onSelect}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button 
        className="mobile-menu-btn" 
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="content-viewport">
        <Navbar
          user={user}
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        />

        <div className="scrollable-content">
          <Routes>
            <Route path="/dashboard" element={<PatientDashboard key="overview" />} />
            <Route path="/heart" element={<PatientDashboard key="heart" />} />
            <Route path="/diabetes" element={<PatientDashboard key="diabetes" />} />
            <Route path="/kidney" element={<PatientDashboard key="kidney" />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/copilot" element={<CopilotPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/diet-plan" element={<DietPlanPage />} />
            <Route path="/exercise-guide" element={<ExerciseGuidePage />} />
            <Route path="/bp-tracker" element={<BPTrackerPage />} />
            <Route path="/specialists" element={<SpecialistsPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AppShell;
