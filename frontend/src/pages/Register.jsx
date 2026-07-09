// frontend/src/pages/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaChevronRight,
  FaHeartbeat,
} from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../api/client";
import { toast } from "react-hot-toast";
import "./Auth.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-enterprise">
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card-premium glass-card"
      >
        <div className="auth-header">
          <div className="auth-logo">
            <FaHeartbeat />
          </div>
          <h1>
            Create <span>Account</span>
          </h1>
          <p>Join the enterprise healthcare intelligence network.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-group">
            <label>
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Dr. John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-group">
            <label>
              <FaEnvelope /> Clinical Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@hospital.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="auth-group">
            <label>
              <FaLock /> Secure Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="auth-security-info">
            <FaShieldAlt />
            <span>Encrypted with enterprise-grade clinical security.</span>
          </div>
          <button
            type="submit"
            className="btn-premium btn-primary large auth-btn"
            disabled={loading}
          >
            {loading ? "Initializing..." : "Create Enterprise Account"}{" "}
            <FaChevronRight />
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
