// frontend/src/App.js

import React, { useState } from "react";

import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";

import { FaArrowRight, FaUserPlus } from "react-icons/fa";

import "./App.css";

function App() {
  // ======================================================
  // USER STATE
  // ======================================================

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");

    return stored ? JSON.parse(stored) : null;
  });

  // ======================================================
  // APP MODE
  // ======================================================

  const [mode, setMode] = useState(() => {
    if (!user) {
      return "landing";
    }

    return user.role === "admin" ? "admin" : "dashboard";
  });

  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);

    if (loggedUser.role === "admin") {
      setMode("admin");
    } else {
      setMode("dashboard");
    }
  };

  // ======================================================
  // REGISTERED
  // ======================================================

  const handleRegistered = () => {
    setMode("login");
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setMode("landing");
  };

  // ======================================================
  // LANDING ACTIONS
  // ======================================================

  const handleGetStarted = () => {
    setMode("login");
  };

  return (
    <div className="app-container">
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      {user && <Navbar user={user} onLogout={handleLogout} />}

      {/* ======================================================
          LANDING PAGE
      ====================================================== */}

      {!user && mode === "landing" && (
        <div className="landing-wrapper">
          <LandingPage onGetStarted={handleGetStarted} />

          {/* FLOATING ACTIONS */}

          <div className="floating-actions">
            <button
              className="floating-primary-btn"
              onClick={() => setMode("login")}
            >
              <FaArrowRight />
              Get Started
            </button>

            <button
              className="floating-secondary-btn"
              onClick={() => setMode("register")}
            >
              <FaUserPlus />
              Register
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
          LOGIN PAGE
      ====================================================== */}

      {!user && mode === "login" && (
        <div className="auth-layout">
          <Login
            onLogin={handleLogin}
            goToRegister={() => setMode("register")}
            goHome={() => setMode("landing")}
          />
        </div>
      )}

      {/* ======================================================
          REGISTER PAGE
      ====================================================== */}

      {!user && mode === "register" && (
        <div className="auth-layout">
          <Register
            onRegistered={handleRegistered}
            goToLogin={() => setMode("login")}
            goHome={() => setMode("landing")}
          />
        </div>
      )}

      {/* ======================================================
          PATIENT DASHBOARD
      ====================================================== */}

      {user && mode === "dashboard" && (
        <div className="dashboard-wrapper">
          <PatientDashboard />
        </div>
      )}

      {/* ======================================================
          ADMIN DASHBOARD
      ====================================================== */}

      {user && mode === "admin" && (
        <div className="dashboard-wrapper">
          <AdminDashboard />
        </div>
      )}
    </div>
  );
}

export default App;
