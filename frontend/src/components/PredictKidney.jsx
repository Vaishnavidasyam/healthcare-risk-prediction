import React, { useState } from "react";
import {
  FaNotesMedical,
} from "react-icons/fa";

import api from "../api/client";
import RiskResultCard from "./RiskResultCard";
import "./PredictKidney.css";

const PredictKidney = ({ onComplete }) => {
  const [form, setForm] = useState({
    age: "", bp: "", sg: "", al: "", su: "", bgr: "", bu: "", sc: "", sod: "", pot: "",
    hemo: "", pcv: "", rc: "", wc: "", pc: "", pcc: "", ba: "", rbc: "", htn: "",
    pe: "", appet: "", dm: "", cad: "", ane: ""
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fillLowRiskSample = () => {
    setForm({
      age: "30", bp: "70", sg: "1.025", al: "0", su: "0", bgr: "95", bu: "18", sc: "0.9",
      sod: "140", pot: "4.2", hemo: "15.5", pcv: "46", rc: "5.2", wc: "7800",
      pc: "normal", pcc: "notpresent", ba: "notpresent", rbc: "normal", htn: "no",
      pe: "no", appet: "good", dm: "no", cad: "no", ane: "no"
    });
  };

  const fillMediumRiskSample = () => {
    setForm({
      age: "45", bp: "75", sg: "1.015", al: "1", su: "0", bgr: "120", bu: "30", sc: "1.2",
      sod: "138", pot: "4.3", hemo: "13.0", pcv: "40", rc: "4.5", wc: "7500",
      pc: "normal", pcc: "notpresent", ba: "notpresent", rbc: "normal", htn: "no",
      pe: "no", appet: "good", dm: "no", cad: "no", ane: "no"
    });
  };

  const fillPositiveSample = () => {
    setForm({
      age: "60", bp: "80", sg: "1.01", al: "2", su: "1", bgr: "150", bu: "40", sc: "1.8",
      sod: "135", pot: "4.5", hemo: "11.0", pcv: "35", rc: "3.5", wc: "8000",
      pc: "normal", pcc: "present", ba: "present", rbc: "normal", htn: "yes",
      pe: "yes", appet: "poor", dm: "yes", cad: "yes", ane: "yes"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const payload = { ...form };
      // Convert numeric fields
      const numericFields = ["age", "bp", "sg", "al", "su", "bgr", "bu", "sc", "sod", "pot", "hemo", "pcv", "rc", "wc"];
      numericFields.forEach(f => payload[f] = Number(payload[f]));

      const res = await api.post("/predictions/kidney", payload);
      setResult(res.data);
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-form-container glass-card">
      <div className="prediction-header">
        <div className="prediction-header-icon"><FaNotesMedical /></div>
        <div>
          <h2 className="page-title">Kidney Disease <span>Risk Prediction</span></h2>
          <p className="page-description">Comprehensive AI renal health diagnostics.</p>
        </div>
      </div>

      <div className="sample-btn-wrapper">
        <button type="button" className="secondary-btn low-btn" onClick={fillLowRiskSample}>Low Risk</button>
        <button type="button" className="secondary-btn medium-btn" onClick={fillMediumRiskSample}>Medium Risk</button>
        <button type="button" className="secondary-btn high-btn" onClick={fillPositiveSample}>High Risk</button>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        {Object.keys(form).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.toUpperCase()}</label>
            {["pc", "pcc", "ba", "rbc", "htn", "pe", "appet", "dm", "cad", "ane"].includes(key) ? (
              <select name={key} value={form[key]} onChange={handleChange} required>
                <option value="">Select</option>
                {key === "pc" || key === "rbc" ? (
                  <><option value="normal">Normal</option><option value="abnormal">Abnormal</option></>
                ) : key === "appet" ? (
                  <><option value="good">Good</option><option value="poor">Poor</option></>
                ) : key === "pcc" || key === "ba" ? (
                  <><option value="present">Present</option><option value="notpresent">Not Present</option></>
                ) : (
                  <><option value="yes">Yes</option><option value="no">No</option></>
                )}
              </select>
            ) : (
              <input type="number" step="any" name={key} value={form[key]} onChange={handleChange} required />
            )}
          </div>
        ))}
        <button type="submit" className="btn-premium btn-primary full-width-btn" disabled={loading}>
          {loading ? "Analyzing..." : "Predict Kidney Risk"}
        </button>
      </form>

      {error && <div className="error-message-box">{error}</div>}

      {result && (
        <RiskResultCard
          result={{
            ...result,
            risk_percentage: result.risk_percentage,
            risk: Number(result.risk_percentage) / 100
          }}
          diseaseType="Kidney"
        />
      )}
    </div>
  );
};

export default PredictKidney;
