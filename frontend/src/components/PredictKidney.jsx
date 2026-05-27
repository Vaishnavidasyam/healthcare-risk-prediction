// frontend/src/components/PredictKidney.jsx

import React, { useState } from "react";

import {
  FaNotesMedical,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeartbeat,
  FaTint,
} from "react-icons/fa";

import api from "../api/client";
import "./PredictKidney.css";

const PredictKidney = () => {
  const [form, setForm] = useState({
    // NUMERIC
    age: "",
    bp: "",
    sg: "",
    al: "",
    su: "",
    bgr: "",
    bu: "",
    sc: "",
    sod: "",
    pot: "",
    hemo: "",
    pcv: "",
    rc: "",
    wc: "",

    // CATEGORICAL
    pc: "",
    pcc: "",
    ba: "",
    rbc: "",
    htn: "",
    pe: "",
    appet: "",
    dm: "",
    cad: "",
    ane: "",
  });

  const [result, setResult] = useState(null);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  // ======================================================
  // HANDLE INPUT
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
      age: "30",
      bp: "70", // normal BP
      sg: "1.025", // normal/high specific gravity
      al: "0", // no albumin
      su: "0", // no sugar
      bgr: "95", // normal blood glucose
      bu: "18", // normal urea
      sc: "0.9", // normal creatinine
      sod: "140", // normal sodium
      pot: "4.2", // normal potassium
      hemo: "15.5", // good hemoglobin
      pcv: "46", // normal PCV
      rc: "5.2", // normal RBC count
      wc: "7800", // normal WBC

      pc: "normal",
      pcc: "notpresent",
      ba: "notpresent",
      rbc: "normal",
      htn: "no",
      pe: "no",
      appet: "good",
      dm: "no",
      cad: "no",
      ane: "no",
    });
  };

  // ======================================================
  // MEDIUM RISK SAMPLE
  // ======================================================
  const fillMediumRiskSample = () => {
    setForm({
      age: "45",
      bp: "75",
      sg: "1.02",
      al: "0", // no albumin now
      su: "0",
      bgr: "115",
      bu: "22",
      sc: "1.1",
      sod: "138",
      pot: "4.5",
      hemo: "13.5",
      pcv: "41",
      rc: "4.6",
      wc: "8100",

      pc: "normal",
      pcc: "notpresent",
      ba: "notpresent",
      rbc: "normal",
      htn: "yes",
      pe: "no",
      appet: "good",
      dm: "no",
      cad: "no",
      ane: "no",
    });
  };

  // ======================================================
  // HIGH RISK SAMPLE
  // ======================================================

  const fillPositiveSample = () => {
    setForm({
      age: "60",
      bp: "80",
      sg: "1.01", // low specific gravity
      al: "2", // higher albumin
      su: "1", // sugar present
      bgr: "150", // high glucose
      bu: "40", // elevated urea
      sc: "1.8", // elevated creatinine
      sod: "135",
      pot: "4.5",
      hemo: "11.0", // low hemoglobin
      pcv: "35",
      rc: "3.5",
      wc: "8000",

      pc: "normal",
      pcc: "present", // pus cell clumps
      ba: "present", // bacteria present
      rbc: "normal",
      htn: "yes",
      pe: "yes", // pedal edema
      appet: "poor",
      dm: "yes",
      cad: "yes",
      ane: "yes", // anemia
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
        // NUMERIC
        age: Number(form.age),

        bp: Number(form.bp),

        sg: Number(form.sg),

        al: Number(form.al),

        su: Number(form.su),

        bgr: Number(form.bgr),

        bu: Number(form.bu),

        sc: Number(form.sc),

        sod: Number(form.sod),

        pot: Number(form.pot),

        hemo: Number(form.hemo),

        pcv: Number(form.pcv),

        rc: Number(form.rc),

        wc: Number(form.wc),

        // CATEGORICAL
        pc: form.pc,
        pcc: form.pcc,
        ba: form.ba,
        rbc: form.rbc,
        htn: form.htn,
        pe: form.pe,
        appet: form.appet,
        dm: form.dm,
        cad: form.cad,
        ane: form.ane,
      };

      const res = await api.post("/predict/kidney", payload);

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
          <FaNotesMedical />
        </div>

        <div>
          <h2 className="page-title">Kidney Disease Risk Prediction</h2>

          <p className="page-description">
            Analyze kidney health indicators using AI-powered predictive
            healthcare analytics.
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
        {Object.keys(form).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.toUpperCase()}</label>

            {[
              "pc",
              "pcc",
              "ba",
              "rbc",
              "htn",
              "pe",
              "appet",
              "dm",
              "cad",
              "ane",
            ].includes(key) ? (
              <select
                name={key}
                value={form[key]}
                onChange={handleChange}
                required
              >
                <option value="">Select Option</option>

                {key === "pc" || key === "rbc" ? (
                  <>
                    <option value="normal">Normal</option>

                    <option value="abnormal">Abnormal</option>
                  </>
                ) : key === "appet" ? (
                  <>
                    <option value="good">Good</option>

                    <option value="poor">Poor</option>
                  </>
                ) : key === "pcc" || key === "ba" ? (
                  <>
                    <option value="present">Present</option>

                    <option value="notpresent">Not Present</option>
                  </>
                ) : (
                  <>
                    <option value="yes">Yes</option>

                    <option value="no">No</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type="number"
                step="any"
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                required
              />
            )}
          </div>
        ))}

        {/* SUBMIT */}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Analyzing Kidney Data..." : "Predict Kidney Risk"}
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
              <h3>{result.risk_level} Kidney Risk</h3>

              <p>
                Estimated Risk Score: <strong>{result.risk_percentage}%</strong>
              </p>
            </div>
          </div>

          {/* RESULT MESSAGE */}

          <div className="result-message">
            {result.risk_level === "High" && (
              <p>
                Your kidney disease risk appears high. Immediate medical
                consultation and further diagnosis are strongly recommended.
              </p>
            )}

            {result.risk_level === "Medium" && (
              <p>
                Your kidney health indicators show moderate risk. Maintain
                hydration, healthy diet, and regular monitoring.
              </p>
            )}

            {result.risk_level === "Low" && (
              <p>
                Your kidney health indicators appear stable. Continue healthy
                lifestyle habits and routine checkups.
              </p>
            )}
          </div>

          {/* RECOMMENDATIONS */}

          <div className="recommendation-card">
            <h3>AI Health Recommendations</h3>

            <div className="recommendation-list">
              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaTint />
                </div>

                <p>Drink enough water daily and reduce excess salt intake.</p>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaHeartbeat />
                </div>

                <p>Monitor blood pressure and glucose levels regularly.</p>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <FaNotesMedical />
                </div>

                <p>Maintain kidney-friendly nutrition and avoid smoking.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictKidney;
