// frontend/src/pages/Register.jsx

import React, { useEffect, useState } from "react";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaHeartbeat,
  FaShieldAlt,
  FaUserMd,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoon,
  FaSun,
  FaHome,
  FaSignInAlt,
  FaChartLine,
} from "react-icons/fa";

import api from "../api/client";

import "./Auth.css";

import healthScreening from "../assets/health-screening.png";

import healthScreeningDark from "../assets/health-screening1.png";

const Register = ({ onRegistered, goToLogin, goHome }) => {
  // ======================================================
  // DEMO DATA PRE-FILLED
  // ======================================================

  const [name, setName] = useState("Demo User");

  const [email, setEmail] = useState("demo@example.com");

  const [password, setPassword] = useState("demo123");

  const [confirmPassword, setConfirmPassword] = useState("demo123");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("auth-theme") || "dark",
  );

  // ======================================================
  // THEME
  // ======================================================

  useEffect(() => {
    document.body.classList.remove("auth-dark", "auth-light");

    document.body.classList.add(theme === "dark" ? "auth-dark" : "auth-light");

    localStorage.setItem("auth-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // ======================================================
  // RESET DEMO DATA
  // ======================================================

  const fillDemoData = () => {
    setName("Vaishnavi");

    setEmail("test@example.com");

    setPassword("test123");

    setConfirmPassword("test123");
  };

  // ======================================================
  // REGISTER
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");

      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage("success");

      setTimeout(() => {
        if (onRegistered) {
          onRegistered();
        }
      }, 1500);
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.response?.data?.msg;

      setMessage(backendMsg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="auth-page">
      {/* ======================================================
          THEME TOGGLE
      ====================================================== */}

      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>

      {/* ======================================================
          LEFT SIDE
      ====================================================== */}

      <div className="auth-left">
        {/* BRAND */}

        <div className="auth-brand">
          <div className="auth-brand-logo">
            <img
              src={theme === "dark" ? healthScreeningDark : healthScreening}
              alt="SmartMed Analytics"
            />
          </div>

          <div className="auth-brand-text">
            <h1>SmartMed Analytics</h1>

            <p>AI-Powered Healthcare Analytics</p>
          </div>
        </div>

        {/* HERO */}

        <div className="auth-left-content">
          <div className="hero-badge">
            <FaChartLine />

            <span>Advanced Healthcare AI</span>
          </div>

          <h2>Join The Future Of AI Healthcare Intelligence</h2>

          <p>
            Create your account to access intelligent disease prediction,
            healthcare analytics, and AI-powered medical insights.
          </p>

          {/* FEATURES */}

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="feature-icon">
                <FaHeartbeat />
              </div>

              <div>
                <h4>Heart Risk Prediction</h4>

                <p>AI-powered cardiovascular risk analysis and monitoring.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon">
                <FaUserMd />
              </div>

              <div>
                <h4>Healthcare Insights</h4>

                <p>Personalized medical analytics and recommendations.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>

              <div>
                <h4>Secure Platform</h4>

                <p>
                  Protected patient records and secure healthcare data storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="auth-right">
        <div className="auth-card premium-auth-card">
          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="auth-card-header">
            <h2>Create Account</h2>

            <p>Start your AI healthcare journey today.</p>
          </div>

          {/* ======================================================
              DEMO CARD
          ====================================================== */}

          {/* ======================================================
              FORM
          ====================================================== */}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* NAME */}

            <div className="auth-input-group">
              <label>Full Name</label>

              <div className="auth-input-wrapper">
                <FaUser />

                <input
                  type="text"
                  value={name}
                  placeholder="Enter your full name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="auth-input-group">
              <label>Email Address</label>

              <div className="auth-input-wrapper">
                <FaEnvelope />

                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="auth-input-group">
              <label>Password</label>

              <div className="auth-input-wrapper">
                <FaLock />

                <input
                  type="password"
                  value={password}
                  placeholder="Create password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="auth-input-group">
              <label>Confirm Password</label>

              <div className="auth-input-wrapper">
                <FaLock />

                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* TERMS */}

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" required />

                <span>I agree to Terms & Conditions</span>
              </label>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Register Account
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* ERROR */}

          {message && message !== "success" && (
            <div className="auth-error">
              <FaExclamationTriangle />

              <span>{message}</span>
            </div>
          )}

          {/* SUCCESS */}

          {message === "success" && (
            <div className="auth-success">
              <FaCheckCircle />

              <span>Registration successful!</span>
            </div>
          )}

          {/* FOOTER */}

          <div className="auth-footer">
            <p>SmartMed Analytics © 2026</p>
          </div>

          {/* BOTTOM */}

          <div className="auth-bottom-section">
            <div>
              <h4>Already have an account?</h4>

              <p>Login and continue using AI healthcare analytics.</p>
            </div>

            <div className="auth-bottom-buttons">
              {/* HOME */}

              <button
                type="button"
                className="auth-outline-btn"
                onClick={goHome}
              >
                <FaHome />
                Back Home
              </button>

              {/* LOGIN */}

              <button
                type="button"
                className="auth-gradient-btn"
                onClick={goToLogin}
              >
                <FaSignInAlt />
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
