// frontend/src/components/PredictDiabetes.jsx

import React, { useState } from "react";

import {
  FaTint,
  FaHeartbeat,
  FaCheckCircle,
  FaExclamationTriangle,
  FaNotesMedical,
} from "react-icons/fa";

import api from "../api/client";

import "./PredictDiabetes.css";
const PredictDiabetes = () => {
  const [form, setForm] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const [result, setResult] = useState(null);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // LOW RISK SAMPLE
  // ======================================================

  // LOW RISK SAMPLE
  const fillLowRiskSample = () => {
    setForm({
      Pregnancies: "0",
      Glucose: "90", // normal fasting glucose
      BloodPressure: "70", // normal
      SkinThickness: "20",
      Insulin: "80",
      BMI: "22.0", // normal BMI
      DiabetesPedigreeFunction: "0.15",
      Age: "24",
    });
  };

  // ============================================
  // MEDIUM RISK DIABETES SAMPLE
  // ============================================

  const fillMediumRiskSample = () => {
    setForm({
      Pregnancies: "4",

      Glucose: "145",

      BloodPressure: "82",

      SkinThickness: "28",

      Insulin: "140",

      BMI: "31.5",

      DiabetesPedigreeFunction: "0.55",

      Age: "42",
    });
  };

  // ======================================================
  // HIGH RISK SAMPLE
  // ======================================================

  // HIGH RISK SAMPLE (known positive case)
  const fillPositiveSample = () => {
    setForm({
      Pregnancies: "6",
      Glucose: "148", // clearly high
      BloodPressure: "72",
      SkinThickness: "35",
      Insulin: "0",
      BMI: "33.6", // obese range
      DiabetesPedigreeFunction: "0.627",
      Age: "50",
    });
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError(null);

    setResult(null);

    try {
      const payload = {
        Pregnancies: Number(form.Pregnancies),

        Glucose: Number(form.Glucose),

        BloodPressure: Number(form.BloodPressure),

        SkinThickness: Number(form.SkinThickness),

        Insulin: Number(form.Insulin),

        BMI: Number(form.BMI),

        DiabetesPedigreeFunction: Number(form.DiabetesPedigreeFunction),

        Age: Number(form.Age),
      };

      const res = await api.post("/predict/diabetes", payload);

      setResult(res.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Prediction failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RESULT CLASS
  // ======================================================

  const getResultClass = () => {
    if (!result) return "";

    if (result.risk_level === "High") {
      return "high-risk";
    }

    if (result.risk_level === "Medium") {
      return "medium-risk";
    }

    return "low-risk";
  };

  return (
    <div className="prediction-form-container">
      {/* HEADER */}

      <div className="prediction-header">
        <div className="prediction-header-icon">
          <FaTint />
        </div>

        <div>
          <h2 className="page-title">Diabetes Risk Prediction</h2>

          <p className="page-description">
            Analyze glucose, insulin, BMI, and healthcare indicators using
            AI-powered predictive analytics.
          </p>
        </div>
      </div>

      {/* SAMPLE BUTTONS */}

      <div className="sample-btn-wrapper">
        <button
          type="button"
          className="secondary-btn low-btn"
          onClick={fillLowRiskSample}
        >
          Low Risk
        </button>

        <button
          type="button"
          className="secondary-btn medium-btn"
          onClick={fillMediumRiskSample}
        >
          Medium Risk
        </button>

        <button
          type="button"
          className="secondary-btn high-btn"
          onClick={fillPositiveSample}
        >
          High Risk
        </button>
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="form-grid">
        {/* Pregnancies */}

        <div className="form-group">
          <label>Pregnancies</label>

          <input
            type="number"
            name="Pregnancies"
            placeholder="e.g. 2"
            value={form.Pregnancies}
            onChange={handleChange}
            required
          />
        </div>

        {/* Glucose */}

        <div className="form-group">
          <label>Glucose Level</label>

          <input
            type="number"
            name="Glucose"
            placeholder="e.g. 120"
            value={form.Glucose}
            onChange={handleChange}
            required
          />
        </div>

        {/* Blood Pressure */}

        <div className="form-group">
          <label>Blood Pressure</label>

          <input
            type="number"
            name="BloodPressure"
            placeholder="e.g. 80"
            value={form.BloodPressure}
            onChange={handleChange}
            required
          />
        </div>

        {/* Skin Thickness */}

        <div className="form-group">
          <label>Skin Thickness</label>

          <input
            type="number"
            name="SkinThickness"
            placeholder="e.g. 30"
            value={form.SkinThickness}
            onChange={handleChange}
            required
          />
        </div>

        {/* Insulin */}

        <div className="form-group">
          <label>Insulin</label>

          <input
            type="number"
            name="Insulin"
            placeholder="e.g. 100"
            value={form.Insulin}
            onChange={handleChange}
            required
          />
        </div>

        {/* BMI */}

        <div className="form-group">
          <label>BMI</label>

          <input
            type="number"
            step="0.1"
            name="BMI"
            placeholder="e.g. 28.4"
            value={form.BMI}
            onChange={handleChange}
            required
          />
        </div>

        {/* DPF */}

        <div className="form-group">
          <label>Diabetes Pedigree Function</label>

          <input
            type="number"
            step="0.01"
            name="DiabetesPedigreeFunction"
            placeholder="e.g. 0.52"
            value={form.DiabetesPedigreeFunction}
            onChange={handleChange}
            required
          />
        </div>

        {/* AGE */}

        <div className="form-group">
          <label>Age</label>

          <input
            type="number"
            name="Age"
            placeholder="e.g. 45"
            value={form.Age}
            onChange={handleChange}
            required
          />
        </div>

        {/* BUTTON */}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Analyzing Health Data..." : "Predict Diabetes Risk"}
        </button>
      </form>

      {/* ERROR */}

      {error && (
        <div className="error">
          <FaExclamationTriangle />

          <span>{error}</span>
        </div>
      )}

      {/* RESULT */}

      {result && (
        <div className={`result ${getResultClass()}`}>
          <div className="result-header">
            <div className="result-icon">
              {result.risk_level === "High" ? (
                <FaExclamationTriangle />
              ) : (
                <FaCheckCircle />
              )}
            </div>

            <div>
              <h3>{result.risk_level} Diabetes Risk</h3>

              <p>
                Estimated Risk Score: <strong>{result.risk_percentage}%</strong>
              </p>
            </div>
          </div>

          {/* RESULT MESSAGE */}

          <div className="result-message">
            {result.risk_level === "High" && (
              <p>
                Your diabetes risk appears to be high. Medical consultation and
                blood sugar monitoring are strongly recommended.
              </p>
            )}

            {result.risk_level === "Medium" && (
              <p>
                Your diabetes risk is moderate. Healthy eating, exercise, and
                regular health checkups are recommended.
              </p>
            )}

            {result.risk_level === "Low" && (
              <p>
                Your diabetes risk appears low. Continue maintaining healthy
                lifestyle habits.
              </p>
            )}
          </div>

          {/* RECOMMENDATIONS */}

          <div className="recommendation-card">
            <h3>AI Health Recommendations</h3>

            <div className="recommendation-list">
              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaNotesMedical />
                </div>

                <p>Exercise for at least 30 minutes daily.</p>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaNotesMedical />
                </div>

                <p>Reduce sugar intake and avoid processed foods.</p>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaNotesMedical />
                </div>

                <p>Drink enough water and maintain proper sleep cycles.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictDiabetes;
