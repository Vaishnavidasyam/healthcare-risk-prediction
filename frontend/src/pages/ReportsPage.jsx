import React, { useState, useEffect } from "react";
import {
  FaFileMedical,
  FaUpload,
  FaFilePdf,
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaCloudDownloadAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMicroscope,
  FaPlus,
  FaHistory,
  FaChevronRight,
  FaTimes,
  FaBrain,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/client";
import { toast } from "react-hot-toast";

import "./ReportsPage.css";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reportType, setReportType] = useState("Blood Test");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      console.log("Fetching reports history...");
      const res = await api.get("/reports/history");
      console.log("Reports history received:", res.data);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Could not load report history.");
    }
  };

  const fetchReportDetails = async (reportId) => {
    try {
      const res = await api.get(`/reports/${reportId}`);
      setSelectedReport(res.data);
    } catch (err) {
      console.error("Error fetching report details:", err);
    }
  };

  const handleExportCaseStudy = () => {
    if (!selectedReport) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(selectedReport, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `SmartMed_CaseStudy_${selectedReport._id.slice(-8)}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("report_type", reportType);

    try {
      setUploading(true);
      const res = await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Intelligence extraction complete.");
      await fetchReports();
      // Fetch full details of the newly created report using the returned report_id
      await fetchReportDetails(res.data.report_id);
    } catch (err) {
      toast.error("Extraction failed. Unsupported format.");
    } finally {
      setUploading(false);
    }
  };

  const deleteReport = async (e, reportId) => {
    e.stopPropagation();
    try {
      await api.delete(`/reports/${reportId}/delete`);
      toast.success("Report deleted successfully");
      fetchReports();
      if (selectedReport?._id === reportId) {
        setSelectedReport(null);
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error("Failed to delete report");
    }
  };

  const generateSummary = async () => {
    if (!selectedReport) return;
    try {
      setLoading(true);
      console.log("Generating summary for report:", selectedReport._id);
      const response = await api.post(
        `/reports/${selectedReport._id}/generate-summary`,
      );
      console.log("Generate summary response:", response.data);
      toast.success("Summary generated successfully");
      await fetchReportDetails(selectedReport._id);
    } catch (err) {
      console.error(
        "Error generating summary:",
        err.response ? err.response.data : err,
      );
      toast.error(err.response?.data?.error || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-enterprise-page">
      <header className="reports-header-premium">
        <div className="header-left">
          <div className="reports-badge-premium">
            <FaBrain /> Medical Intelligence
          </div>
          <h1>
            Clinical <span>Document</span> Analysis
          </h1>
        </div>
        <div className="ocr-status-pill">
          <div className="pulse"></div> AI Extraction Active
        </div>
      </header>

      <div className="reports-main-layout-premium">
        <aside className="reports-sidebar-premium">
          <div className="upload-zone-premium glass-card">
            <div className="upload-header-mini">
              <h3>Diagnostic Upload</h3>
            </div>
            <div className="report-type-select">
              <label>Context</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>Blood Test</option>
                <option>Cardiology Report</option>
                <option>Metabolic Panel</option>
                <option>Renal Profile</option>
              </select>
            </div>
            <div className="drop-area-premium">
              <input
                type="file"
                id="report-upload"
                hidden
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="report-upload">
                <div className="file-prompt">
                  <FaUpload />
                  <span>
                    {uploading ? "Analyzing..." : "Drop Clinical File"}
                  </span>
                  <p>PDF, PNG or JPG (Max 10MB)</p>
                </div>
              </label>
            </div>
          </div>

          <div className="reports-history-premium glass-card">
            <h5 className="sidebar-label">HISTORY OF ANALYSIS</h5>
            <div className="history-list-premium">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className={`history-item-premium ${selectedReport?._id === r._id ? "active" : ""}`}
                  onClick={() => fetchReportDetails(r._id)}
                >
                  <div className="h-icon">
                    <FaFilePdf />
                  </div>
                  <div className="h-info">
                    <strong>{r.report_type}</strong>
                    <span>{new Date(r.analyzed_at).toLocaleDateString()}</span>
                  </div>
                  <button
                    className="delete-btn-premium"
                    onClick={(e) => deleteReport(e, r._id)}
                    title="Delete report"
                  >
                    <FaTimes />
                  </button>
                  <FaChevronRight className="h-arrow" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="analysis-viewport-premium glass-card">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="analysis-result-premium"
              >
                <div className="analysis-top-nav">
                  <div className="r-meta">
                    <span className="r-id">
                      ID: {selectedReport._id.slice(-8).toUpperCase()}
                    </span>
                    <h2>{selectedReport.report_type} Analysis</h2>
                    <p>
                      Clinical Metadata Extracted:{" "}
                      {new Date(selectedReport.analyzed_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="btn-premium btn-outline"
                    onClick={handleExportCaseStudy}
                  >
                    <FaFilePdf /> Export Case Study
                  </button>
                </div>

                <div className="analysis-grid-premium">
                  <div className="clinical-data-block">
                    <div className="block-header">
                      <h3>
                        <FaMicroscope /> Extracted Parameters
                      </h3>
                    </div>
                    <div className="premium-table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                            <th>Reference</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReport.parameters &&
                          Object.keys(selectedReport.parameters).length > 0 ? (
                            Object.entries(selectedReport.parameters).map(
                              ([key, p], i) => (
                                <tr
                                  key={i}
                                  className={
                                    p.status === "High" || p.status === "Low"
                                      ? "critical-row"
                                      : ""
                                  }
                                >
                                  <td>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </td>
                                  <td>
                                    <strong>
                                      {p.value} {p.unit}
                                    </strong>
                                  </td>
                                  <td>
                                    {p.normal_range
                                      ? `${p.normal_range[0]}-${p.normal_range[1]}`
                                      : "N/A"}
                                  </td>
                                  <td>
                                    <span
                                      className={`verdict-pill ${p.status === "Normal" ? "good" : "bad"}`}
                                    >
                                      {p.status || "Normal"}
                                    </span>
                                  </td>
                                </tr>
                              ),
                            )
                          ) : (
                            <tr>
                              <td colSpan="4" style={{ textAlign: "center" }}>
                                No parameters extracted.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <aside className="analysis-side-panel">
                    <div className="ai-narrative-card glass-card">
                      <div className="card-header-premium">
                        <h3>AI Health Narrative</h3>
                        {!selectedReport.ai_analysis?.summary && (
                          <button
                            className="btn-premium btn-xs"
                            onClick={generateSummary}
                            disabled={loading}
                          >
                            {loading ? "Generating..." : "Generate Summary"}
                          </button>
                        )}
                      </div>
                      <div className="narrative-content-premium">
                        {selectedReport.ai_analysis?.summary ? (
                          <div
                            className="formatted-summary"
                            dangerouslySetInnerHTML={{
                              __html: selectedReport.ai_analysis.summary
                                .replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>",
                                )
                                .replace(/\n/g, "<br />"),
                            }}
                          />
                        ) : (
                          <p>No summary available for this report.</p>
                        )}
                      </div>
                    </div>
                    {selectedReport.ai_analysis?.risk_factors &&
                      selectedReport.ai_analysis.risk_factors.length > 0 && (
                        <div className="risk-alerts-card glass-card">
                          <h3>Critical Risk Markers</h3>
                          <div className="alert-stack">
                            {selectedReport.ai_analysis.risk_factors.map(
                              (rf, i) => (
                                <div key={i} className="mini-alert-pill">
                                  <strong>{rf.replace("_", " ")}</strong>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </aside>
                </div>
              </motion.div>
            ) : (
              <div className="analysis-empty-premium">
                <div className="empty-content-box">
                  <FaMicroscope className="empty-icon" />
                  <h2>Awaiting Clinical Data</h2>
                  <p>Select a medical report from history or upload a new file to begin analysis.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
