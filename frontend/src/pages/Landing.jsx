// frontend/src/pages/Landing.jsx

import React, { useState, useEffect } from "react";
import {
  FaBrain,
  FaChartLine,
  FaShieldAlt,
  FaMicroscope,
  FaRobot,
  FaChevronRight,
  FaCheckCircle,
  FaArrowUp,
  FaHeartbeat,
  FaTint,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/health-screening.png";
import "./LandingPage.css";

const Landing = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="landing-enterprise">
      {/* NAVIGATION */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-wrapper">
            <img src={logo} alt="SmartMed Analytics" className="logo-image" />
          </div>

          <span>
            SmartMed <span>Analytics</span>
          </span>
        </div>
        <div className="nav-links">
          <a href="#features">Solutions</a>
          <a href="#intelligence">Intelligence</a>
          <a href="#enterprise">Enterprise</a>
          <button
            className="theme-toggle-nav"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/login" className="btn-login-minimal">
            Sign In
          </Link>
          <Link to="/register" className="btn-get-started">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero-enterprise">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <FaShieldAlt /> <span>HIPAA Compliant • Enterprise Grade AI</span>
          </motion.div>
          <motion.h1 variants={itemVariants}>
            Predictive <span>Healthcare</span> <br /> Intelligence for the
            Future
          </motion.h1>
          <motion.p variants={itemVariants}>
            SmartMed Analytics transforms raw medical data into actionable
            clinical insights. Empowering healthcare providers and patients with
            AI-driven risk assessments, automated report analysis, and
            explainable medical logic.
          </motion.p>
          <motion.div variants={itemVariants} className="hero-actions">
            <Link to="/register" className="btn-premium btn-primary large">
              Sign Up <FaChevronRight />
            </Link>
          </motion.div>

          {/* FLOATING PREVIEW CARDS */}
        </motion.div>
      </header>

      {/* FEATURES GRID */}
      <section id="features" className="features-grid-section">
        <div className="section-header">
          <h2>
            Advanced AI <span>Capabilities</span>
          </h2>
          <p>
            Built on proprietary medical intelligence models and clinical
            reasoning engines.
          </p>
        </div>
        <div className="features-container">
          {[
            {
              icon: <FaMicroscope />,
              title: "Report Intelligence",
              desc: "Automated extraction and analysis of clinical parameters from PDF & images with OCR.",
            },
            {
              icon: <FaBrain />,
              title: "Disease Prediction",
              desc: "Deep learning models for early-stage detection of heart, diabetes, and kidney risks.",
            },
            {
              icon: <FaRobot />,
              title: "Clinical Copilot",
              desc: "Context-aware AI assistant for medical term explanation and health coaching.",
            },
            {
              icon: <FaShieldAlt />,
              title: "Explainable AI (XAI)",
              desc: "Transparent decision-making with SHAP visualizations for every risk score.",
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              className="feature-glass-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="feat-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
              <div className="feat-link">
                Explore Module <FaChevronRight />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INTELLIGENCE SECTION */}
      <section id="intelligence" className="intelligence-promo">
        <div className="intel-visual">
          <div className="intel-card-mock">
            <div className="mock-header">
              <FaBrain /> <span>AI Feature Importance</span>
            </div>
            <div className="mock-bars">
              <div className="bar-row">
                <span className="lbl">Cholesterol</span>
                <div className="bar red" style={{ width: "80%" }}></div>
                <span className="val">+24%</span>
              </div>
              <div className="bar-row">
                <span className="lbl">Glucose</span>
                <div className="bar orange" style={{ width: "60%" }}></div>
                <span className="val">+18%</span>
              </div>
              <div className="bar-row">
                <span className="lbl">Activity</span>
                <div className="bar green" style={{ width: "40%" }}></div>
                <span className="val">-12%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="intel-text">
          <div className="premium-badge">EXPLAINABLE AI</div>
          <h2>
            No More <span>Black Box</span> Predictions
          </h2>
          <p>
            SmartMed Analytics makes AI decisions transparent. Understand the
            exact clinical factors contributing to your health profile with
            integrated SHAP visualizations and medical logic.
          </p>
          <ul className="check-list">
            <li>
              <FaCheckCircle /> Factor Contribution Percentages
            </li>
            <li>
              <FaCheckCircle /> Feature Importance Radar Charts
            </li>
            <li>
              <FaCheckCircle /> Interactive clinical summaries
            </li>
          </ul>
        </div>
      </section>

      {/* ENTERPRISE CTA */}
      <section id="enterprise" className="enterprise-cta">
        <div className="cta-glass">
          <h2>
            Ready to revolutionize your <span>healthcare diagnostics?</span>
          </h2>
          <p>
            Join 500+ professionals using SmartMed AI for clinical decision
            support.
          </p>
          <div className="cta-btns">
            <Link to="/register" className="btn-premium btn-primary large">
              Sign Up <FaChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-wrapper">
              <img src={logo} alt="SmartMed Analytics" className="logo-image" />
            </div>

            <h3>SmartMed Analytics</h3>
            <p>Enterprise AI Healthcare Intelligence</p>
          </div>
          <div className="footer-links-grid">
            <div className="link-col">
              <h4>Platform</h4>
              <a href="#">Report Analysis</a>
              <a href="#">Predictive Models</a>
              <a href="#">Clinical Copilot</a>
            </div>
            <div className="link-col">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Clinical Partners</a>
              <a href="#">Security</a>
            </div>
            <div className="link-col">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">HIPAA Compliance</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SmartMed Analytics Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
