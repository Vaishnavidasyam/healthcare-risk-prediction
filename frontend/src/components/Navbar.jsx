// frontend/src/components/Navbar.jsx

import React, { useEffect, useState } from "react";

import { FaMoon, FaSun, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

import logo from "../assets/health-screening.png";

import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  // ======================================================
  // THEME
  // ======================================================

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.classList.remove("dark-theme", "light-theme");

    document.body.classList.add(`${theme}-theme`);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="navbar">
      {/* ======================================================
          LEFT
      ====================================================== */}

      <div className="navbar-left">
        <div className="navbar-logo-wrapper">
          <img src={logo} alt="Healthcare Logo" className="navbar-logo-image" />
        </div>

        <div className="navbar-brand">
          <h2>SmartMed Analytics</h2>

          <p>AI-Powered Disease Prediction Platform</p>
        </div>
      </div>

      {/* ======================================================
          RIGHT
      ====================================================== */}

      <div className="navbar-right">
        {/* USER */}

        <div className="navbar-user-card">
          <FaUserCircle className="navbar-user-icon" />

          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {user?.email || "Guest User"}
            </span>

            <span className="navbar-user-role">{user?.role || "Patient"}</span>
          </div>
        </div>

        {/* THEME TOGGLE */}

        <button className="navbar-theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        {/* LOGOUT */}

        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />

          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
