// frontend/src/components/DoctorCard.jsx
// Premium Doctor Recommendation Card

import React from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaStar,
  FaMapMarkerAlt,
  FaCalendar,
  FaPhone,
  FaVideo,
  FaChevronRight,
  FaClock,
  FaAward,
} from "react-icons/fa";

const DoctorCard = ({
  name = "Dr. Sarah Johnson",
  specialty = "Cardiologist",
  qualification = "MD, FACC",
  experience = 15,
  rating = 4.9,
  reviews = 234,
  location = "Cleveland Clinic, OH",
  availability = "Available Today",
  consultationFee = 150,
  image = null,
  onNextDay,
  onVideoCall,
  onViewProfile,
  className = "",
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      className={`doctor-card glass-card ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Doctor Header */}
      <div className="doctor-header">
        {/* Avatar */}
        <div className="doctor-avatar">
          {image ? (
            <img src={image} alt={name} />
          ) : (
            <div className="avatar-placeholder">
              <FaUserMd />
              <span>{getInitials(name)}</span>
            </div>
          )}
          {/* Availability Badge */}
          <div className="availability-badge available">
            <span className="dot"></span>
            {availability}
          </div>
        </div>

        {/* Doctor Info */}
        <div className="doctor-info">
          <h3 className="doctor-name">{name}</h3>
          <p className="doctor-qualification">{qualification}</p>
          <div className="doctor-specialty">
            <FaAward />
            <span>{specialty}</span>
          </div>
          <div className="doctor-experience">
            <FaClock />
            <span>{experience} years experience</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="doctor-rating">
        <div className="rating-stars">
          <FaStar />
          <span>{rating}</span>
        </div>
        <span className="rating-count">({reviews} reviews)</span>
      </div>

      {/* Location */}
      <div className="doctor-location">
        <FaMapMarkerAlt />
        <span>{location}</span>
      </div>

      {/* Consultation Fee */}
      <div className="consultation-fee">
        <span className="fee-label">Consultation</span>
        <span className="fee-amount">${consultationFee}</span>
      </div>

      {/* Action Buttons */}
      <div className="doctor-actions">
        {onVideoCall && (
          <button className="btn-premium btn-outline" onClick={onVideoCall}>
            <FaVideo />
            Video Call
          </button>
        )}
        {onNextDay && (
          <button className="btn-premium btn-primary" onClick={onNextDay}>
            <FaCalendar />
            Next Day
          </button>
        )}
        {onViewProfile && (
          <button className="btn-text" onClick={onViewProfile}>
            View Profile <FaChevronRight />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Doctor List Component
export const DoctorList = ({ doctors = [], onSelect, className = "" }) => {
  return (
    <div className={`doctor-list ${className}`}>
      {doctors.map((doctor, index) => (
        <DoctorCard
          key={index}
          {...doctor}
          onNextDay={() => onSelect && onSelect(doctor, "next-day")}
          onVideoCall={() => onSelect && onSelect(doctor, "video")}
          onViewProfile={() => onSelect && onSelect(doctor, "profile")}
        />
      ))}
    </div>
  );
};

export default DoctorCard;
