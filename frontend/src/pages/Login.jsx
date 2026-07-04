// frontend/src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/client";
import { toast } from "react-hot-toast";
import "./Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back to SmartMed AI");

      // Role-based redirect
      const user = res.data.user;
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed.");
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
          {/* SVG icon instead of react-icons to avoid import issues */}
          <div className="auth-logo">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
          </div>
          <h1>
            Clinical <span>Sign In</span>
          </h1>
          <p>Access your secure healthcare intelligence dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-group">
            <label>Clinical Email</label>
            <input
              type="email"
              name="email"
              placeholder="clinical@smartmed.ai"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-group">
            <label>Secure Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-extra">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember for 30 days
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="btn-premium btn-primary large auth-btn"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Authorize Access"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New to SmartMed?{" "}
            <Link to="/register">Create Enterprise Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
