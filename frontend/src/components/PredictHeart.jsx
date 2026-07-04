import React, { useState } from "react";
import {
  FaHeartbeat,
  FaExclamationTriangle,
} from "react-icons/fa";

import api from "../api/client";
import RiskResultCard from "./RiskResultCard";
import "./PredictHeart.css";

const PredictHeart = ({ onComplete }) => {
  const [form, setForm] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
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
      age: "28",
      sex: "0",
      cp: "2",
      trestbps: "108",
      chol: "160",
      fbs: "0",
      restecg: "0",
      thalach: "182",
      exang: "0",
      oldpeak: "0.1",
      slope: "0",
      ca: "0",
      thal: "1",
    });
  };

  const fillMediumRiskSample = () => {
    setForm({
      age: "55",
      sex: "1",
      cp: "1",
      trestbps: "135",
      chol: "230",
      fbs: "0",
      restecg: "1",
      thalach: "145",
      exang: "1",
      oldpeak: "1.2",
      slope: "1",
      ca: "1",
      thal: "2",
    });
  };

  const fillPositiveSample = () => {
    setForm({
      age: "67",
      sex: "1",
      cp: "3",
      trestbps: "180",
      chol: "320",
      fbs: "1",
      restecg: "2",
      thalach: "90",
      exang: "1",
      oldpeak: "5.2",
      slope: "2",
      ca: "4",
      thal: "3",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const payload = {
        age: Number(form.age),
        sex: Number(form.sex),
        cp: Number(form.cp),
        trestbps: Number(form.trestbps),
        chol: Number(form.chol),
        fbs: Number(form.fbs),
        restecg: Number(form.restecg),
        thalach: Number(form.thalach),
        exang: Number(form.exang),
        oldpeak: Number(form.oldpeak),
        slope: Number(form.slope),
        ca: Number(form.ca),
        thal: Number(form.thal),
      };

      const res = await api.post("/predictions/heart", payload);
      setResult(res.data);
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Prediction failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-form-container glass-card">
      <div className="prediction-header">
        <div className="prediction-header-icon">
          <FaHeartbeat />
        </div>
        <div>
          <h2 className="page-title">Heart Disease <span>Risk Prediction</span></h2>
          <p className="page-description">
            Analyze cardiovascular health indicators using AI-powered predictive analytics.
          </p>
        </div>
      </div>

      <div className="sample-btn-wrapper">
        <button type="button" className="secondary-btn low-btn" onClick={fillLowRiskSample}>Low Risk</button>
        <button type="button" className="secondary-btn medium-btn" onClick={fillMediumRiskSample}>Medium Risk</button>
        <button type="button" className="secondary-btn high-btn" onClick={fillPositiveSample}>High Risk</button>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Sex</label>
          <select name="sex" value={form.sex} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Chest Pain Type (0-3)</label>
          <input type="number" name="cp" value={form.cp} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Resting Blood Pressure</label>
          <input type="number" name="trestbps" value={form.trestbps} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Cholesterol</label>
          <input type="number" name="chol" value={form.chol} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Fasting Blood Sugar</label>
          <select name="fbs" value={form.fbs} onChange={handleChange} required>
            <option value="">Select Option</option>
            <option value="1">&gt; 120 mg/dl</option>
            <option value="0">&lt; 120 mg/dl</option>
          </select>
        </div>
        <div className="form-group">
          <label>Resting ECG (0-2)</label>
          <input type="number" name="restecg" value={form.restecg} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Max Heart Rate</label>
          <input type="number" name="thalach" value={form.thalach} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Exercise Induced Angina</label>
          <select name="exang" value={form.exang} onChange={handleChange} required>
            <option value="">Select Option</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
        <div className="form-group">
          <label>ST Depression (Oldpeak)</label>
          <input type="number" step="0.1" name="oldpeak" value={form.oldpeak} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Slope (0-2)</label>
          <input type="number" name="slope" value={form.slope} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Major Vessels (0-4)</label>
          <input type="number" name="ca" value={form.ca} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Thalassemia (0-3)</label>
          <input type="number" name="thal" value={form.thal} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-premium btn-primary full-width-btn" disabled={loading}>
          {loading ? "Analyzing Heart Data..." : "Predict Heart Risk"}
        </button>
      </form>

      {error && <div className="error-message-box"><FaExclamationTriangle /> {error}</div>}

      {result && (
        <RiskResultCard
          result={{
            ...result,
            risk: Number(result.risk_percentage) / 100
          }}
          diseaseType="Heart"
        />
      )}
    </div>
  );
};

export default PredictHeart;
