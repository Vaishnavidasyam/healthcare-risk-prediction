import React from "react";
import { FaMoon, FaSun, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/health-screening.png";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo-wrapper">
          <img
            src={logo}
            alt="Healthcare Logo"
            className="navbar-logo-image"
          />
        </div>

        <div className="navbar-brand">
          <h2>SmartMed Analytics</h2>
          <p>AI-Powered Disease Prediction Platform</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-user-card">
          <FaUserCircle className="navbar-user-icon" />

          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {user?.email || "Guest User"}
            </span>
            <span className="navbar-user-role">{user?.role || "Patient"}</span>
          </div>
        </div>

        <button className="navbar-theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
