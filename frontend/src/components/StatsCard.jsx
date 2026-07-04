// frontend/src/components/StatsCard.jsx
// Premium Stats Card for Admin Dashboard

import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaChartLine,
  FaFileMedical,
  FaBrain,
  FaHeartbeat,
  FaDollarSign,
  FaHospital,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";

const StatsCard = ({
  title = "Total Users",
  value = 0,
  suffix = "",
  prefix = "",
  icon = null,
  trend = 0,
  trendLabel = "vs last month",
  color = "blue",
  onClick,
  className = "",
}) => {
  // Color configurations
  const colorConfig = {
    blue: {
      bg: "var(--status-info-bg)",
      iconBg: "var(--status-info-bg)",
      iconColor: "var(--status-info)",
      trendColor: "var(--status-info)",
    },
    green: {
      bg: "var(--status-success-bg)",
      iconBg: "var(--status-success-bg)",
      iconColor: "var(--status-success)",
      trendColor: "var(--status-success)",
    },
    orange: {
      bg: "var(--status-warning-bg)",
      iconBg: "var(--status-warning-bg)",
      iconColor: "var(--status-warning)",
      trendColor: "var(--status-warning)",
    },
    red: {
      bg: "var(--status-danger-bg)",
      iconBg: "var(--status-danger-bg)",
      iconColor: "var(--status-danger)",
      trendColor: "var(--status-danger)",
    },
    purple: {
      bg: "rgba(139, 92, 246, 0.1)",
      iconBg: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      trendColor: "#8b5cf6",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  // Icon mapping
  const iconMap = {
    users: <FaUsers />,
    chart: <FaChartLine />,
    medical: <FaFileMedical />,
    brain: <FaBrain />,
    heartbeat: <FaHeartbeat />,
    dollar: <FaDollarSign />,
    hospital: <FaHospital />,
    clipboard: <FaClipboardList />,
  };

  const displayIcon = icon || iconMap[Object.keys(iconMap)[0]];

  // Trend icon
  const getTrendIcon = () => {
    if (trend > 0) return <FaArrowUp />;
    if (trend < 0) return <FaArrowDown />;
    return <FaMinus />;
  };

  const getTrendClass = () => {
    if (trend > 0) return "positive";
    if (trend < 0) return "negative";
    return "neutral";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  // Animated counter
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className={`stats-card glass-card ${onClick ? "clickable" : ""} ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
    >
      {/* Icon */}
      <div
        className="stats-icon-wrapper"
        style={config.iconBg ? { background: config.iconBg } : {}}
      >
        <span style={config.iconColor ? { color: config.iconColor } : {}}>
          {displayIcon}
        </span>
      </div>

      {/* Content */}
      <div className="stats-content">
        <span className="stats-title">{title}</span>
        <div className="stats-value-row">
          <span className="stats-value">
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
          </span>
        </div>
        {trend !== undefined && (
          <div className={`stats-trend ${getTrendClass()}`}>
            <span
              className="trend-icon"
              style={config.trendColor ? { color: config.trendColor } : {}}
            >
              {getTrendIcon()}
            </span>
            <span className="trend-value">
              {trend > 0 ? "+" : ""}
              {Math.abs(trend)}%
            </span>
            <span className="trend-label">{trendLabel}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Stats Grid Component
export const StatsGrid = ({ stats = [], className = "" }) => {
  return (
    <div className={`stats-grid ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCard;
