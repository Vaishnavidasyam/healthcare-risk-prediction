import React from "react";
import {
  FaChartPie,
  FaHeart,
  FaTint,
  FaNotesMedical,
  FaChartLine,
  FaFileMedical,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaBrain,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/health-screening.png";
import "./Sidebar.css";

const Sidebar = ({ active, onSelect, collapsed, setCollapsed }) => {
  const menuSections = [
    {
      section: "OVERVIEW",
      color: "#6366f1", // Indigo
      items: [ { key: "overview", label: "Dashboard", icon: <FaChartPie /> } ],
    },
    {
      section: "INTELLIGENCE",
      color: "#8b5cf6", // Violet
      items: [
        { key: "copilot", label: "AI Assistant", icon: <FaBrain /> },
        { key: "reports", label: "Report Intelligence", icon: <FaFileMedical /> },
      ],
    },
    {
      section: "TRACKING",
      color: "#14b8a6", // Teal
      items: [ { key: "analytics", label: "Analytics", icon: <FaChartLine /> } ],
    },
    {
      section: "PREDICTIONS",
      color: "#ec4899", // Pink
      items: [
        { key: "heart", label: "Heart Risk", icon: <FaHeart /> },
        { key: "diabetes", label: "Diabetes Risk", icon: <FaTint /> },
        { key: "kidney", label: "Kidney Risk", icon: <FaNotesMedical /> },
      ],
    },
  ];

  return (
    <aside className={`enterprise-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-logo-wrapper">
          <img src={logo} alt="SmartMed AI" className="brand-logo" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span 
              className="brand-name"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              SmartMed <span>AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button 
        className="collapse-btn" 
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className="sidebar-scroll-area">
        {menuSections.map((section, idx) => (
          <div key={idx} className="sidebar-section" style={{ '--section-color': section.color }}>
            <AnimatePresence>
              {!collapsed && (
                <motion.h5 
                  className="section-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {section.section}
                </motion.h5>
              )}
            </AnimatePresence>
            <div className="section-items">
              {section.items.map((item) => (
                <button
                  key={item.key}
                  className={`menu-item ${active === item.key ? "active" : ""}`}
                  onClick={() => onSelect(item.key)}
                  title={collapsed ? item.label : ""}
                >
                  <span className="item-icon">{item.icon}</span>
                  {!collapsed && <span className="item-label">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="menu-item settings-btn" onClick={() => onSelect("settings")}>
          <span className="item-icon"><FaCog /></span>
          {!collapsed && <span className="item-label">Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
