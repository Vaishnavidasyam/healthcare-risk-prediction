// frontend/src/components/HealthTimeline.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaHistory, FaCheckCircle, FaStethoscope, FaFileMedical } from "react-icons/fa";
import "./HealthTimeline.css";

const HealthTimeline = ({ events = [] }) => {
  return (
    <div className="timeline-container-premium glass-card">
      <div className="card-header-flex">
        <h3>Clinical Timeline</h3>
        <FaHistory className="text-muted" />
      </div>

      <div className="timeline-scroll-premium">
        {events.length > 0 ? (
          events.map((event, index) => (
            <motion.div 
                className="timeline-event-enterprise" 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
            >
              <div className="event-meta">
                <div className={`event-dot ${event.event_type}`}></div>
                <div className="event-line"></div>
              </div>
              <div className="event-content">
                <span className="event-time">
                  {new Date(event.event_date).toLocaleDateString()}
                </span>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="setup-timeline">
            <div className="setup-step complete">
              <span><FaCheckCircle /></span>
              <div><strong>Account secured</strong><p>Your private workspace is ready.</p></div>
            </div>
            <div className="setup-step active">
              <span><FaStethoscope /></span>
              <div><strong>Complete an assessment</strong><p>Generate your first clinical risk result.</p></div>
            </div>
            <div className="setup-step">
              <span><FaFileMedical /></span>
              <div><strong>Add medical context</strong><p>Upload a report for richer insights.</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTimeline;
