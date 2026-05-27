// frontend/src/pages/RecommendationsPage.jsx

import React from "react";

import {
  FaHeartbeat,
  FaTint,
  FaWalking,
  FaAppleAlt,
  FaBrain,
  FaMoon,
  FaWater,
  FaDumbbell,
  FaBed,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

import "./RecommendationsPage.css";

const RecommendationsPage = () => {
  return (
    <div className="recommendations-page">
      {/* =========================================
          HERO SECTION
      ========================================= */}

      <div className="recommendations-hero">
        <div className="recommendations-hero-left">
          <div className="recommendations-badge">
            <FaBrain />
            <span>AI Wellness Intelligence</span>
          </div>

          <h1>
            Personalized <span>Health Recommendations</span>
          </h1>

          <p>
            AI-powered healthcare wellness recommendations designed to improve
            heart health, diabetes prevention, kidney protection, nutrition,
            fitness, sleep quality, and overall lifestyle balance.
          </p>

          <div className="recommendations-stats">
            <div className="recommendation-stat-card">
              <h2>98%</h2>
              <span>AI Accuracy</span>
            </div>

            <div className="recommendation-stat-card">
              <h2>24/7</h2>
              <span>Health Monitoring</span>
            </div>

            <div className="recommendation-stat-card">
              <h2>100+</h2>
              <span>Health Insights</span>
            </div>
          </div>
        </div>

        <div className="recommendations-hero-right">
          <div className="recommendation-glass-card">
            <FaShieldAlt />

            <h3>AI Health Assistant</h3>

            <p>Smart healthcare wellness engine active.</p>

            <div className="recommendation-live-status">
              <span></span>
              Personalized Insights Enabled
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          RECOMMENDATIONS GRID
      ========================================= */}

      <div className="recommendations-grid">
        {/* HEART */}

        <div className="recommendation-card">
          <div className="recommendation-top">
            <div className="recommendation-main-icon red">
              <FaHeartbeat />
            </div>

            <div className="recommendation-status">
              <FaCheckCircle />
              Active
            </div>
          </div>

          <h3>Cardiovascular Health</h3>

          <p>
            Improve heart wellness with regular exercise, blood pressure
            tracking, and stress management techniques.
          </p>

          <ul className="recommendation-points">
            <li>
              <FaArrowRight />
              30 minutes aerobic exercise daily
            </li>

            <li>
              <FaArrowRight />
              Monitor blood pressure weekly
            </li>

            <li>
              <FaArrowRight />
              Reduce processed food intake
            </li>
          </ul>
        </div>

        {/* DIABETES */}

        <div className="recommendation-card">
          <div className="recommendation-top">
            <div className="recommendation-main-icon blue">
              <FaTint />
            </div>

            <div className="recommendation-status">
              <FaCheckCircle />
              Recommended
            </div>
          </div>

          <h3>Diabetes Prevention</h3>

          <p>
            Maintain balanced glucose levels through healthy eating habits and
            smart lifestyle management.
          </p>

          <ul className="recommendation-points">
            <li>
              <FaArrowRight />
              Reduce excess sugar consumption
            </li>

            <li>
              <FaArrowRight />
              Monitor glucose levels regularly
            </li>

            <li>
              <FaArrowRight />
              Include fiber-rich foods in meals
            </li>
          </ul>
        </div>

        {/* NUTRITION */}

        <div className="recommendation-card">
          <div className="recommendation-top">
            <div className="recommendation-main-icon green">
              <FaAppleAlt />
            </div>

            <div className="recommendation-status">
              <FaCheckCircle />
              Healthy
            </div>
          </div>

          <h3>Healthy Nutrition</h3>

          <p>
            Maintain kidney-friendly nutrition and balanced hydration to support
            long-term health.
          </p>

          <ul className="recommendation-points">
            <li>
              <FaArrowRight />
              Consume fresh fruits and vegetables
            </li>

            <li>
              <FaArrowRight />
              Drink adequate water daily
            </li>

            <li>
              <FaArrowRight />
              Limit excessive sodium intake
            </li>
          </ul>
        </div>

        {/* FITNESS */}

        <div className="recommendation-card">
          <div className="recommendation-top">
            <div className="recommendation-main-icon purple">
              <FaWalking />
            </div>

            <div className="recommendation-status">
              <FaCheckCircle />
              Tracking
            </div>
          </div>

          <h3>Daily Physical Activity</h3>

          <p>
            Improve overall wellness through consistent movement, exercise, and
            healthy daily habits.
          </p>

          <ul className="recommendation-points">
            <li>
              <FaArrowRight />
              Walk at least 8,000 steps daily
            </li>

            <li>
              <FaArrowRight />
              Include stretching exercises
            </li>

            <li>
              <FaArrowRight />
              Maintain active lifestyle routines
            </li>
          </ul>
        </div>

        {/* HYDRATION */}

        <div className="recommendation-card">
          <div className="recommendation-top">
            <div className="recommendation-main-icon cyan">
              <FaWater />
            </div>

            <div className="recommendation-status">
              <FaCheckCircle />
              Important
            </div>
          </div>

          <h3>Hydration Management</h3>

          <p>
            Proper hydration supports kidney function, metabolism, and overall
            body performance.
          </p>

          <ul className="recommendation-points">
            <li>
              <FaArrowRight />
              Drink 2–3 liters of water daily
            </li>

            <li>
              <FaArrowRight />
              Avoid excessive sugary beverages
            </li>

            <li>
              <FaArrowRight />
              Maintain electrolyte balance
            </li>
          </ul>
        </div>

        {/* SLEEP */}

        <div className="recommendation-card">
          <div className="recommendation-top">
            <div className="recommendation-main-icon orange">
              <FaBed />
            </div>

            <div className="recommendation-status">
              <FaCheckCircle />
              Essential
            </div>
          </div>

          <h3>Sleep & Recovery</h3>

          <p>
            Healthy sleep patterns improve immunity, cardiovascular health, and
            mental wellness.
          </p>

          <ul className="recommendation-points">
            <li>
              <FaArrowRight />
              Sleep 7–8 hours consistently
            </li>

            <li>
              <FaArrowRight />
              Reduce screen time before bed
            </li>

            <li>
              <FaArrowRight />
              Maintain a regular sleep schedule
            </li>
          </ul>
        </div>
      </div>

      {/* =========================================
          BOTTOM SECTION
      ========================================= */}

      <div className="recommendations-bottom">
        <div className="wellness-card">
          <div className="wellness-icon">
            <FaDumbbell />
          </div>

          <div>
            <h2>AI Wellness Tracking</h2>

            <p>
              Continue following AI-driven wellness recommendations to improve
              your overall healthcare profile and reduce disease risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
