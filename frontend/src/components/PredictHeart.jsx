// frontend/src/components/PredictHeart.jsx

import React, { useState } from "react";

import {
  FaHeartbeat,
  FaCheckCircle,
  FaExclamationTriangle,
  FaNotesMedical,
  FaChartLine,
} from "react-icons/fa";

import api from "../api/client";
import "./PredictHeart.css";

const PredictHeart = () => {
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

  // ======================================================
  // MEDIUM RISK SAMPLE
  // ======================================================

  // MEDIUM RISK SAMPLE
  const fillMediumRiskSample = () => {
    setForm({
      age: "55",
      sex: "1", // male
      cp: "1", // atypical angina
      trestbps: "135", // mildly elevated BP
      chol: "230", // borderline high cholesterol
      fbs: "0", // fasting blood sugar < 120 mg/dl
      restecg: "1",
      thalach: "145", // reasonable exercise capacity
      exang: "1", // exercise-induced angina present
      oldpeak: "1.2", // some ST depression
      slope: "1", // flat slope
      ca: "1", // one major vessel
      thal: "2", // typical value
    });
  };

  // ======================================================
  // HIGH RISK SAMPLE
  // ======================================================

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

  // ======================================================
  // SUBMIT
  // ======================================================

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

      const res = await api.post("/predict/heart", payload);

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
          <FaHeartbeat />
        </div>

        <div>
          <h2 className="page-title">Heart Disease Risk Prediction</h2>

          <p className="page-description">
            Analyze cardiovascular health indicators using AI-powered predictive
            analytics.
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
        {/* AGE */}

        <div className="form-group">
          <label>Age</label>

          <input
            type="number"
            name="age"
            placeholder="e.g. 45"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* SEX */}

        <div className="form-group">
          <label>Sex</label>

          <select name="sex" value={form.sex} onChange={handleChange} required>
            <option value="">Select Gender</option>

            <option value="1">Male</option>

            <option value="0">Female</option>
          </select>
        </div>

        {/* CP */}

        <div className="form-group">
          <label>Chest Pain Type</label>

          <input
            type="number"
            name="cp"
            placeholder="0 - 3"
            value={form.cp}
            onChange={handleChange}
            required
          />
        </div>

        {/* BP */}

        <div className="form-group">
          <label>Resting Blood Pressure</label>

          <input
            type="number"
            name="trestbps"
            placeholder="e.g. 120"
            value={form.trestbps}
            onChange={handleChange}
            required
          />
        </div>

        {/* CHOL */}

        <div className="form-group">
          <label>Cholesterol</label>

          <input
            type="number"
            name="chol"
            placeholder="e.g. 220"
            value={form.chol}
            onChange={handleChange}
            required
          />
        </div>

        {/* FBS */}

        <div className="form-group">
          <label>Fasting Blood Sugar</label>

          <select name="fbs" value={form.fbs} onChange={handleChange} required>
            <option value="">Select Option</option>

            <option value="1">Greater than 120 mg/dl</option>

            <option value="0">Less than 120 mg/dl</option>
          </select>
        </div>

        {/* ECG */}

        <div className="form-group">
          <label>Resting ECG</label>

          <input
            type="number"
            name="restecg"
            placeholder="0 - 2"
            value={form.restecg}
            onChange={handleChange}
            required
          />
        </div>

        {/* HR */}

        <div className="form-group">
          <label>Max Heart Rate</label>

          <input
            type="number"
            name="thalach"
            placeholder="e.g. 150"
            value={form.thalach}
            onChange={handleChange}
            required
          />
        </div>

        {/* EXANG */}

        <div className="form-group">
          <label>Exercise Induced Angina</label>

          <select
            name="exang"
            value={form.exang}
            onChange={handleChange}
            required
          >
            <option value="">Select Option</option>

            <option value="1">Yes</option>

            <option value="0">No</option>
          </select>
        </div>

        {/* OLDPEAK */}

        <div className="form-group">
          <label>ST Depression</label>

          <input
            type="number"
            step="0.1"
            name="oldpeak"
            placeholder="e.g. 1.2"
            value={form.oldpeak}
            onChange={handleChange}
            required
          />
        </div>

        {/* SLOPE */}

        <div className="form-group">
          <label>Slope</label>

          <input
            type="number"
            name="slope"
            placeholder="0 - 2"
            value={form.slope}
            onChange={handleChange}
            required
          />
        </div>

        {/* CA */}

        <div className="form-group">
          <label>Major Vessels</label>

          <input
            type="number"
            name="ca"
            placeholder="0 - 4"
            value={form.ca}
            onChange={handleChange}
            required
          />
        </div>

        {/* THAL */}

        <div className="form-group">
          <label>Thalassemia</label>

          <input
            type="number"
            name="thal"
            placeholder="0 - 3"
            value={form.thal}
            onChange={handleChange}
            required
          />
        </div>

        {/* SUBMIT */}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Analyzing Heart Data..." : "Predict Heart Risk"}
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
              <h3>{result.risk_level} Heart Risk</h3>

              <p>
                Estimated Risk Score: <strong>{result.risk_percentage}%</strong>
              </p>
            </div>
          </div>

          {/* RESULT MESSAGE */}

          <div className="result-message">
            {result.risk_level === "High" && (
              <p>
                Your heart disease risk appears high. Immediate medical
                consultation and lifestyle changes are strongly recommended.
              </p>
            )}

            {result.risk_level === "Medium" && (
              <p>
                Your cardiovascular risk is moderate. Exercise, healthy diet,
                and regular monitoring are recommended.
              </p>
            )}

            {result.risk_level === "Low" && (
              <p>
                Your heart health indicators appear stable. Continue maintaining
                a healthy lifestyle.
              </p>
            )}
          </div>

          {/* AI RECOMMENDATIONS */}

          <div className="recommendation-card">
            <h3>AI Health Recommendations</h3>

            <div className="recommendation-list">
              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaNotesMedical />
                </div>

                <p>Maintain regular cardio exercise and physical activity.</p>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaChartLine />
                </div>

                <p>Monitor blood pressure and cholesterol regularly.</p>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaHeartbeat />
                </div>

                <p>Avoid smoking, stress, and unhealthy food intake.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictHeart;
