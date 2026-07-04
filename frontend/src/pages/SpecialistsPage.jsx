import React from "react";
import { motion } from "framer-motion";
import { useRecommendations } from "../context/RecommendationContext";
import { useNavigate } from "react-router-dom";
import { 
  FaUserMd, FaHospital, FaCheckCircle, FaExclamationTriangle, 
  FaArrowRight, FaBrain, FaPhoneAlt, FaMapMarkerAlt, FaStar,
  FaCalendarAlt, FaStethoscope, FaInfoCircle
} from "react-icons/fa";
import "./PremiumContent.css";
import "./SpecialistsPage.css";
import { PremiumHeroBanner, PremiumCard, ActionTimeline } from "../components/PremiumUI";

const SpecialistsPage = () => {
  const { getRecommendations, latestAssessment } = useRecommendations();
  const navigate = useNavigate();
  const recommendations = getRecommendations();

  if (!recommendations || !latestAssessment) {
    return (
      <div className="premium-page-container">
        <div className="empty-state glass-card">
          <FaInfoCircle />
          <h2>No Active Assessment Found</h2>
          <p>Complete a health assessment to receive personalized specialist recommendations.</p>
          <button className="btn-premium btn-primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const { specialist } = recommendations;
  const { diseaseType, risk_level } = latestAssessment;

  // Mock specialist profile
  const doctor = {
    name: `Dr. Sarah ${diseaseType === 'Heart' ? 'Miller' : diseaseType === 'Diabetes' ? 'Chen' : 'Adams'}`,
    specialty: specialist.name,
    experience: "15+ Years",
    rating: 4.9,
    hospital: "SmartMed University Hospital",
    languages: "English, Spanish"
  };

  const actionSteps = [
    { title: "Review Assessment", description: "Your AI risk report is ready for specialist review." },
    { title: "Schedule Consultation", description: `Book a session within the recommended ${risk_level === 'High' ? '7' : '14'} day window.` },
    { title: "Clinical Follow-up", description: "Bring your latest biometric trends and blood reports." }
  ];

  return (
    <div className="premium-page-container">
      <PremiumHeroBanner 
        eyebrow="Professional Consultation"
        title={`Find Your ${specialist.name}`}
        description={`Priority: ${specialist.priority}. ${specialist.reason}`}
        icon={<FaUserMd />}
      />

      <div className="premium-grid-layout">
        <PremiumCard title="Why this Specialist?" icon={<FaBrain />} className="full-width-card">
          <p className="strategy-text">{specialist.reason}</p>
        </PremiumCard>

        {/* Doctor Profile Card */}
        <motion.div className="glass-card specialist-profile-card" whileHover={{ y: -5 }}>
          <div className="profile-header">
            <div className="avatar-placeholder"><FaUserMd /></div>
            <div>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty}</p>
            </div>
            <div className="rating"><FaStar /> {doctor.rating}</div>
          </div>
          <div className="profile-details">
            <p><FaHospital /> {doctor.hospital}</p>
            <p>Experience: {doctor.experience}</p>
            <p>Languages: {doctor.languages}</p>
          </div>
          <div className="action-footer">
            <button className="btn-premium btn-outline">View Profile</button>
            <button className="btn-premium btn-primary">Book Appointment</button>
          </div>
        </motion.div>

        {/* Action Timeline */}
        <PremiumCard title="Consultation Action Plan" icon={<FaCalendarAlt />}>
          <ActionTimeline steps={actionSteps} />
        </PremiumCard>
      </div>

      {risk_level === 'High' && (
        <motion.div className="critical-alert-card glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="alert-header">
            <FaExclamationTriangle />
            <h3>Urgent Consultation Recommended</h3>
          </div>
          <p>Based on your high risk assessment, please prioritize this consultation within the next 48 hours.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SpecialistsPage;
