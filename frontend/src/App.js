import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Theme & Recommendation Providers
import { ThemeProvider } from "./context/ThemeContext";
import { RecommendationProvider } from "./context/RecommendationContext";

import "./App.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <RecommendationProvider>
          <div className="app-container">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "16px",
                  padding: "16px",
                },
                success: {
                  iconTheme: { primary: "#10b981", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fff" },
                },
              }}
            />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Application Layout with Sidebar */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="enterprise-layout">
                      <AppShell />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </RecommendationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
