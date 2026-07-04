import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';

export const PremiumHeroBanner = ({ title, eyebrow, description, icon }) => (
  <motion.div 
    className="premium-hero-banner"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="hero-content">
      <span className="hero-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    <div className="hero-icon-wrapper">{icon}</div>
  </motion.div>
);

export const ActionTimeline = ({ steps }) => (
  <div className="action-timeline">
    {steps.map((step, index) => (
      <div key={index} className="timeline-step">
        <div className="step-marker"><FaCheckCircle /></div>
        <div className="step-content">
          <h4>{step.title}</h4>
          <p>{step.description}</p>
        </div>
      </div>
    ))}
  </div>
);

export const PremiumCard = ({ title, icon, children, className }) => (
  <div className={`glass-card ${className || ''}`}>
    <div className="card-header-premium">
      <h3>{icon} {title}</h3>
    </div>
    {children}
  </div>
);
