// frontend/src/pages/Login.jsx

import React, { useEffect, useState } from "react";

import {
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaArrowRight,
  FaUserMd,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoon,
  FaSun,
  FaChartLine,
  FaHome,
  FaUserPlus,
} from "react-icons/fa";

import api from "../api/client";

import "./Auth.css";

import healthScreening from "../assets/health-screening.png";

import healthScreeningDark from "../assets/health-screening1.png";

const Login = ({ onLogin, goToRegister, goHome }) => {
  // ======================================================
  // STATES
  // ======================================================

  const [email, setEmail] = useState("test@example.com");

  const [password, setPassword] = useState("test123");

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
  // LOGIN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;

      const user = res.data.user;

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      setMessage("success");

      if (onLogin) {
        onLogin(user);
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.response?.data?.msg;

      setMessage(backendMsg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DEMO ACCOUNT
  // ======================================================

  const fillTestUser = () => {
    setEmail("test@example.com");

    setPassword("test123");
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
          LEFT SECTION
      ====================================================== */}

      <div className="auth-left">
        {/* ======================================================
            BRAND
        ====================================================== */}

        <div className="auth-brand">
          {/* LOGO */}

          <div className="auth-brand-logo">
            <img
              src={theme === "dark" ? healthScreeningDark : healthScreening}
              alt="SmartMed Analytics"
            />
          </div>

          {/* TEXT */}

          <div className="auth-brand-text">
            <h1>SmartMed Analytics</h1>

            <p>AI-Powered Healthcare Analytics</p>
          </div>
        </div>

        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="auth-left-content">
          <div className="hero-badge">
            <FaChartLine />

            <span>AI Healthcare Analytics</span>
          </div>

          <h2>Predict Diseases with Intelligent Healthcare AI</h2>

          <p>
            Securely analyze patient health indicators and get predictive
            insights for heart disease, diabetes, and kidney disease.
          </p>

          {/* ======================================================
              FEATURES
          ====================================================== */}

          <div className="auth-feature-list">
            {/* FEATURE */}

            <div className="auth-feature-item">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>

              <div>
                <h4>Secure Medical Data</h4>

                <p>Your healthcare data is encrypted and securely protected.</p>
              </div>
            </div>

            {/* FEATURE */}

            <div className="auth-feature-item">
              <div className="feature-icon">
                <FaUserMd />
              </div>

              <div>
                <h4>AI Disease Prediction</h4>

                <p>Smart healthcare risk prediction powered by AI models.</p>
              </div>
            </div>

            {/* FEATURE */}

            <div className="auth-feature-item">
              <div className="feature-icon">
                <FaCheckCircle />
              </div>

              <div>
                <h4>Personalized Insights</h4>

                <p>Get predictive analytics and health recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          RIGHT SECTION
      ====================================================== */}

      <div className="auth-right">
        <div className="auth-card premium-auth-card">
          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="auth-card-header">
            <h2>Welcome Back</h2>

            <p>Login to continue your healthcare analytics journey.</p>
          </div>

          {/* ======================================================
              DEMO ACCOUNT
          ====================================================== */}

          {/* ======================================================
              FORM
          ====================================================== */}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* EMAIL */}

            <div className="auth-input-group">
              <label>Email Address</label>

              <div className="auth-input-wrapper">
                <FaEnvelope />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* OPTIONS */}

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" />

                <span>Remember me</span>
              </label>

              <button type="button" className="forgot-password">
                Forgot Password?
              </button>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Login to Dashboard
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* ======================================================
              ERROR
          ====================================================== */}

          {message && message !== "success" && (
            <div className="auth-error">
              <FaExclamationTriangle />

              <span>{message}</span>
            </div>
          )}

          {/* ======================================================
              SUCCESS
          ====================================================== */}

          {message === "success" && (
            <div className="auth-success">
              <FaCheckCircle />

              <span>Login successful!</span>
            </div>
          )}

          {/* ======================================================
              FOOTER
          ====================================================== */}

          <div className="auth-footer">
            <p>SmartMed Analytics © 2026</p>
          </div>

          {/* ======================================================
              BOTTOM SECTION
          ====================================================== */}

          <div className="auth-bottom-section">
            <div>
              <h4>New to the platform?</h4>

              <p>
                Create your account and start using AI healthcare analytics.
              </p>
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

              {/* REGISTER */}

              <button
                type="button"
                className="auth-gradient-btn"
                onClick={goToRegister}
              >
                <FaUserPlus />
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
