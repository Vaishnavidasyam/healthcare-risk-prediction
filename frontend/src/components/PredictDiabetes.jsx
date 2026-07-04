import React, { useState } from "react";
import {
  FaTint,
  FaHeartbeat,
  FaCheckCircle,
  FaExclamationTriangle,
  FaNotesMedical,
} from "react-icons/fa";

import api from "../api/client";
import RiskResultCard from "./RiskResultCard";
import "./PredictDiabetes.css";

const PredictDiabetes = ({ onComplete }) => {
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const fillLowRiskSample = () => {
    setForm({
      Pregnancies: "0",
      Glucose: "90",
      BloodPressure: "70",
      SkinThickness: "20",
      Insulin: "80",
      BMI: "22.0",
      DiabetesPedigreeFunction: "0.15",
      Age: "24",
    });
  };

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

  const fillPositiveSample = () => {
    setForm({
      Pregnancies: "6",
      Glucose: "148",
      BloodPressure: "72",
      SkinThickness: "35",
      Insulin: "0",
      BMI: "33.6",
      DiabetesPedigreeFunction: "0.627",
      Age: "50",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    console.log("Submitting prediction with form:", form);

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
      console.log("Sending payload:", payload);

      const res = await api.post("/predictions/diabetes", payload);
      console.log("Received prediction result:", res.data);
      setResult(res.data);
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Prediction API error:", err);
      console.error("Error response data:", err.response?.data);
      setError(
        err.response?.data?.message || "Prediction failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getResultClass = () => {
    if (!result) return "";
    if (result.risk_level === "High") return "high-risk";
    if (result.risk_level === "Medium") return "medium-risk";
    return "low-risk";
  };

  return (
    <div className="prediction-form-container glass-card">
      <div className="prediction-header">
        <div className="prediction-header-icon">
          <FaTint />
        </div>
        <div>
          <h2 className="page-title">
            Diabetes <span>Risk Prediction</span>
          </h2>
          <p className="page-description">
            Analyze glucose, BMI, and clinical markers using AI predictive
            healthcare intelligence.
          </p>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Pregnancies</label>
          <input
            type="number"
            name="Pregnancies"
            value={form.Pregnancies}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Glucose Level</label>
          <input
            type="number"
            name="Glucose"
            value={form.Glucose}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Blood Pressure</label>
          <input
            type="number"
            name="BloodPressure"
            value={form.BloodPressure}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Skin Thickness</label>
          <input
            type="number"
            name="SkinThickness"
            value={form.SkinThickness}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Insulin</label>
          <input
            type="number"
            name="Insulin"
            value={form.Insulin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>BMI</label>
          <input
            type="number"
            step="0.1"
            name="BMI"
            value={form.BMI}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Diabetes Pedigree Function</label>
          <input
            type="number"
            step="0.01"
            name="DiabetesPedigreeFunction"
            value={form.DiabetesPedigreeFunction}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="Age"
            value={form.Age}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-premium btn-primary full-width-btn"
          disabled={loading}
        >
          {loading ? "Analyzing Health Data..." : "Predict Diabetes Risk"}
        </button>
      </form>

      {error && (
        <div className="error-message-box">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {result && (
        <RiskResultCard
          result={{
            ...result,
            risk: Number(result.risk_percentage) / 100
          }}
          diseaseType="Diabetes"
        />
      )}
    </div>
  );
};

export default PredictDiabetes;
