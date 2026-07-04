// frontend/src/components/HealthScore.jsx
// Premium Health Score Engine with Animated Progress Ring

import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { motion, animate } from "framer-motion";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import "./HealthScore.css";

const HealthScore = ({
  score = 0,
  category = "N/A",
  trend = 0,
  size = "large",
  animated = true,
  showCategory = true,
  showTrend = true,
  showGrade = true,
  hasData = true,
  className = "",
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score on mount/update
  useEffect(() => {
    if (animated) {
      const controls = animate(0, score, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayScore(latest);
        },
      });
      return () => controls.stop();
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  // Determine color based on score
  const getScoreColor = (s) => {
    if (s >= 80) return "#10b981"; // Green - Excellent
    if (s >= 60) return "#3b82f6"; // Blue - Good
    if (s >= 40) return "#f59e0b"; // Orange - Moderate
    return "#ef4444"; // Red - High Risk
  };

  const scoreColor = hasData ? getScoreColor(score) : "#38bdf8";

  // Determine grade
  const getGrade = (s) => {
    if (s >= 90) return "A+";
    if (s >= 80) return "A";
    if (s >= 70) return "B+";
    if (s >= 60) return "B";
    if (s >= 50) return "C";
    if (s >= 40) return "D";
    return "F";
  };

  // Size variants
  const sizeConfig = {
    small: { width: 100, strokeWidth: 8, fontSize: 80 },
    medium: { width: 150, strokeWidth: 10, fontSize: 80 },
    large: { width: 200, strokeWidth: 12, fontSize: 80 },
    xlarge: { width: 280, strokeWidth: 14, fontSize: 80 },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Trend indicator
  const TrendIcon = () => {
    if (trend > 0) return <FaArrowUp className="trend-icon positive" />;
    if (trend < 0) return <FaArrowDown className="trend-icon negative" />;
    return <FaMinus className="trend-icon neutral" />;
  };

  const getTrendClass = () => {
    if (trend > 0) return "positive";
    if (trend < 0) return "negative";
    return "neutral";
  };

  const roundedScore = hasData
    ? Math.round(Number(displayScore)).toString()
    : "--";

  return (
    <motion.div
      className={`health-score-container ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Score Ring */}
      <div
        className="score-ring-wrapper"
        style={{ width: config.width, height: config.width }}
      >
        <CircularProgressbar
          value={hasData ? displayScore : 0}
          maxValue={100}
          text={roundedScore}
          styles={buildStyles({
            pathColor: scoreColor,
            textColor: "var(--text-primary)",
            trailColor: "var(--border-color)",
            strokeLinecap: "round",
            textSize: `${(config.fontSize / config.width) * 100}%`,
            pathTransitionDuration: 0.5,
          })}
        />

        {/* Outer glow effect */}
        <div
          className="score-ring-glow"
          style={{
            boxShadow: `0 0 30px ${scoreColor}40`,
          }}
        />
      </div>

      {/* Score Details */}
      <div className="score-details">
        {showCategory && (
          <motion.span
            className={`grade-badge ${category
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {showGrade && hasData && `${getGrade(score)} | `}
            {category}
          </motion.span>
        )}

        {showTrend && hasData && trend !== undefined && (
          <motion.div
            className={`trend-indicator ${getTrendClass()}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TrendIcon />
            <span>
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </span>
          </motion.div>
        )}
      </div>

      {/* Score interpretation */}
      <motion.p
        className="score-interpretation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {!hasData
          ? "Complete an assessment to calculate your personalized score."
          : score >= 80
            ? "Excellent health indicators. Keep up the great work!"
            : score >= 60
              ? "Good health status. Minor improvements possible."
              : score >= 40
                ? "Moderate health concerns. Consider lifestyle changes."
                : "High risk detected. Immediate attention recommended."}
      </motion.p>
    </motion.div>
  );
};

export default HealthScore;
