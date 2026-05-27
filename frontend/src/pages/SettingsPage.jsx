// frontend/src/pages/SettingsPage.jsx

import React, { useState, useEffect } from "react";

import {
  FaUserShield,
  FaBell,
  FaMoon,
  FaSun,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaUserCog,
  FaDatabase,
  FaHeartbeat,
} from "react-icons/fa";

import "./SettingsPage.css";

const SettingsPage = () => {
  // =========================================
  // THEME STATE
  // =========================================

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const [notifications, setNotifications] = useState(true);

  const [twoFactor, setTwoFactor] = useState(false);

  const [healthAlerts, setHealthAlerts] = useState(true);

  // =========================================
  // THEME EFFECT
  // =========================================

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");

      document.body.classList.remove("light-theme");

      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-theme");

      document.body.classList.remove("dark-theme");

      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleSave = () => {
    alert("Settings Saved Successfully");
  };

  return (
    <div className="settings-page">
      {/* =========================================
          HERO
      ========================================= */}

      <div className="settings-hero">
        <div className="settings-hero-left">
          <div className="settings-badge">
            <FaUserCog />
            <span>Healthcare Preferences</span>
          </div>

          <h1>
            Smart Healthcare <span>Settings</span>
          </h1>

          <p>
            Manage healthcare preferences, AI monitoring alerts, dashboard
            appearance, privacy protection, and advanced security controls.
          </p>
        </div>

        <div className="settings-hero-right">
          <div className="settings-glass-card">
            <FaHeartbeat />

            <h3>AI Health Protection</h3>

            <p>Secure healthcare intelligence system active.</p>

            <div className="settings-live-status">
              <span></span>
              Protected
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          SETTINGS GRID
      ========================================= */}

      <div className="settings-grid">
        {/* PRIVACY */}

        <div className="settings-card">
          <div className="settings-card-top">
            <div className="settings-icon blue">
              <FaUserShield />
            </div>

            <div className="settings-status">
              <FaCheckCircle />
              Active
            </div>
          </div>

          <h3>Privacy & Security</h3>

          <p>
            Control healthcare data access, AI prediction privacy, and secure
            storage settings.
          </p>

          <div className="settings-options">
            <div className="settings-option">
              <span>Data Encryption</span>

              <label className="switch">
                <input type="checkbox" checked readOnly />
                <span className="slider"></span>
              </label>
            </div>

            <div className="settings-option">
              <span>Private Healthcare Mode</span>

              <label className="switch">
                <input type="checkbox" checked readOnly />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}

        <div className="settings-card">
          <div className="settings-card-top">
            <div className="settings-icon orange">
              <FaBell />
            </div>

            <div className="settings-status">
              <FaCheckCircle />
              Enabled
            </div>
          </div>

          <h3>Notifications</h3>

          <p>
            Configure healthcare alerts, AI monitoring reminders, and disease
            risk notifications.
          </p>

          <div className="settings-options">
            <div className="settings-option">
              <span>AI Health Alerts</span>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={healthAlerts}
                  onChange={() => setHealthAlerts(!healthAlerts)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="settings-option">
              <span>Email Notifications</span>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* APPEARANCE */}

        <div className="settings-card">
          <div className="settings-card-top">
            <div className="settings-icon purple">
              {darkMode ? <FaMoon /> : <FaSun />}
            </div>

            <div className="settings-status">
              <FaCheckCircle />
              Active
            </div>
          </div>

          <h3>Appearance</h3>

          <p>
            Customize healthcare dashboard themes, colors, and visual
            accessibility settings.
          </p>

          <div className="theme-selector">
            <button
              className={darkMode ? "theme-btn active-theme" : "theme-btn"}
              onClick={() => setDarkMode(true)}
            >
              <FaMoon />
              Dark Mode
            </button>

            <button
              className={!darkMode ? "theme-btn active-theme" : "theme-btn"}
              onClick={() => setDarkMode(false)}
            >
              <FaSun />
              Light Mode
            </button>
          </div>
        </div>

        {/* ACCOUNT */}

        <div className="settings-card">
          <div className="settings-card-top">
            <div className="settings-icon green">
              <FaLock />
            </div>

            <div className="settings-status">
              <FaShieldAlt />
              Protected
            </div>
          </div>

          <h3>Account Protection</h3>

          <p>
            Secure authentication, password protection, and advanced healthcare
            account safety.
          </p>

          <div className="settings-options">
            <div className="settings-option">
              <span>Two Factor Authentication</span>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={() => setTwoFactor(!twoFactor)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="settings-option">
              <span>Login Protection</span>

              <label className="switch">
                <input type="checkbox" checked readOnly />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM SECTION
      ========================================= */}

      <div className="settings-bottom-grid">
        {/* AI SECURITY */}

        <div className="settings-info-card">
          <div className="settings-info-header">
            <FaDatabase />

            <h3>AI Healthcare Security</h3>
          </div>

          <div className="security-list">
            <div className="security-item">
              <FaCheckCircle />
              End-to-end encrypted prediction data
            </div>

            <div className="security-item">
              <FaCheckCircle />
              Protected healthcare analytics storage
            </div>

            <div className="security-item">
              <FaCheckCircle />
              Secure AI medical recommendation system
            </div>

            <div className="security-item">
              <FaCheckCircle />
              Real-time security monitoring enabled
            </div>
          </div>
        </div>

        {/* SAVE CARD */}

        <div className="settings-info-card save-card">
          <h2>Save Your Preferences</h2>

          <p>
            Apply your healthcare dashboard settings and secure AI monitoring
            preferences instantly.
          </p>

          <button className="save-settings-btn" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
