import React, { useEffect, useState } from "react";

import {
  FaHeartbeat,
  FaShieldAlt,
  FaBrain,
  FaNotesMedical,
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaUserMd,
  FaHospital,
  FaLaptopMedical,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import "./LandingPage.css";

import healthScreening from "../assets/health-screening.png";

import healthScreeningDark from "../assets/health-screening1.png";

const LandingPage = ({ onGetStarted }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("landing-theme") || "dark",
  );

  useEffect(() => {
    document.body.classList.remove("landing-dark", "landing-light");

    document.body.classList.add(
      theme === "dark" ? "landing-dark" : "landing-light",
    );

    localStorage.setItem("landing-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="landing">
      {/* ======================================================
          THEME TOGGLE
      ====================================================== */}

      <button className="landing-theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>

      {/* ======================================================
          HERO
      ====================================================== */}

      <header className="landing-hero">
        {/* ======================================================
            LEFT
        ====================================================== */}

        <div className="landing-hero-text">
          {/* BRANDING */}

          <div className="landing-branding">
            {/* LOGO */}

            <div className="landing-brand-logo">
              <img
                src={theme === "dark" ? healthScreeningDark : healthScreening}
                alt="Health Screening"
              />
            </div>

            {/* TEXT */}

            <div className="landing-brand-text">
              <h2>SmartMed Analytics</h2>

              <div className="landing-badge">
                <FaHeartbeat />

                <span>AI-Powered Healthcare Analytics</span>
              </div>
            </div>
          </div>

          {/* HERO TITLE */}

          <h1>Predict Disease Risk Before It Becomes Critical</h1>

          {/* DESCRIPTION */}

          <p>
            Advanced healthcare risk prediction platform using Artificial
            Intelligence and Machine Learning to detect heart disease, diabetes,
            and kidney disease risks instantly.
          </p>

          {/* BUTTONS */}

          <div className="landing-hero-buttons">
            <button className="landing-primary-btn" onClick={onGetStarted}>
              Get Started
              <FaArrowRight />
            </button>

            <button className="landing-secondary-btn">Learn More</button>
          </div>

          {/* STATS */}

          <div className="landing-stats">
            <div className="landing-stat-card">
              <h2>98%</h2>

              <p>Prediction Accuracy</p>
            </div>

            <div className="landing-stat-card">
              <h2>24/7</h2>

              <p>AI Monitoring</p>
            </div>

            <div className="landing-stat-card">
              <h2>3+</h2>

              <p>Disease Models</p>
            </div>
          </div>
        </div>

        {/* ======================================================
            RIGHT
        ====================================================== */}

        <div className="landing-hero-highlight">
          {/* CARD */}

          <div className="landing-highlight-card">
            <div className="landing-card-icon">
              <FaBrain />
            </div>

            <h3>AI Risk Analysis</h3>

            <p>
              Advanced machine learning models analyze medical indicators and
              predict disease risks instantly.
            </p>
          </div>

          {/* CARD */}

          <div className="landing-highlight-card">
            <div className="landing-card-icon">
              <FaChartLine />
            </div>

            <h3>Predictive Insights</h3>

            <p>
              Visualize health trends, monitor predictions, and identify
              high-risk health conditions early.
            </p>
          </div>

          {/* CARD */}

          <div className="landing-highlight-card">
            <div className="landing-card-icon">
              <FaShieldAlt />
            </div>

            <h3>Secure & Private</h3>

            <p>
              All healthcare records and patient data are encrypted and securely
              protected.
            </p>
          </div>
        </div>
      </header>

      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="landing-section">
        <div className="landing-section-heading">
          <span>HOW IT WORKS</span>

          <h2>Simple AI Healthcare Process</h2>

          <p>
            Easy and intelligent disease prediction workflow powered by machine
            learning.
          </p>
        </div>

        <div className="landing-steps">
          <div className="landing-step">
            <span>1</span>

            <h4>Create Account</h4>

            <p>
              Register securely and access your personalized healthcare
              dashboard.
            </p>
          </div>

          <div className="landing-step">
            <span>2</span>

            <h4>Enter Medical Data</h4>

            <p>
              Add healthcare details like blood pressure, glucose, cholesterol
              and more.
            </p>
          </div>

          <div className="landing-step">
            <span>3</span>

            <h4>AI Prediction</h4>

            <p>
              AI models instantly analyze disease risk levels using advanced
              healthcare data.
            </p>
          </div>

          <div className="landing-step">
            <span>4</span>

            <h4>Get Insights</h4>

            <p>
              Receive preventive healthcare recommendations and AI suggestions.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          FEATURES
      ====================================================== */}

      <section className="landing-section">
        <div className="landing-section-heading">
          <span>FEATURES</span>

          <h2>Healthcare Intelligence Platform</h2>

          <p>
            Smart healthcare tools designed for predictive medical analytics.
          </p>
        </div>

        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <FaHeartbeat />
            </div>

            <h3>Heart Prediction</h3>

            <p>
              Detect cardiovascular risks using AI-powered healthcare analytics.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <FaNotesMedical />
            </div>

            <h3>Diabetes Analysis</h3>

            <p>
              Analyze glucose-related medical indicators for diabetes
              prediction.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <FaHospital />
            </div>

            <h3>Kidney Detection</h3>

            <p>
              Predict chronic kidney disease using clinical healthcare
              indicators.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <FaLaptopMedical />
            </div>

            <h3>Real-Time Analytics</h3>

            <p>Monitor health trends and AI-generated reports visually.</p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <FaUserMd />
            </div>

            <h3>Personalized Insights</h3>

            <p>Get healthcare recommendations based on disease predictions.</p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <FaShieldAlt />
            </div>

            <h3>Secure Data</h3>

            <p>End-to-end protected healthcare data storage system.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
