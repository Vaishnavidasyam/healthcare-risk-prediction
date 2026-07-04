// frontend/src/components/ReportUpload.jsx
// Premium Medical Report Upload with Drag & Drop

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilePdf,
  FaFileImage,
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTrash,
  FaEye,
  FaSpinner,
  FaFileMedical,
  FaScan,
} from "react-icons/fa";

const ReportUpload = ({
  onUpload,
  acceptedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".dicom"],
  maxSize = 10, // MB
  multiple = true,
  className = "",
  showProgress = true,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  // Handle file input change
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  // Process and validate files
  const processFiles = (newFiles) => {
    const validFiles = [];
    const errors = [];

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} exceeds ${maxSize}MB limit`);
        return;
      }

      // Check file type
      const extension = "." + file.name.split(".").pop().toLowerCase();
      if (!acceptedTypes.includes(extension)) {
        errors.push(`${file.name} is not a supported format`);
        return;
      }

      validFiles.push({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: formatFileSize(file.size),
        type: getFileType(extension),
        status: "pending", // pending, uploading, success, error
        progress: 0,
      });
    });

    if (errors.length > 0) {
      console.error("File validation errors:", errors);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Get file type icon
  const getFileType = (extension) => {
    if (extension === ".pdf") return "pdf";
    if ([".jpg", ".jpeg", ".png"].includes(extension)) return "image";
    if (extension === ".dicom") return "dicom";
    return "document";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Remove file
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Update file statuses
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: "uploading", progress: 0 })),
    );

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "success", progress: 100 })),
      );

      if (onUpload) {
        onUpload(files);
      }

      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploading(false);
      }, 1500);
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "error", progress: 0 })),
      );
      setUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className={`report-upload-container ${className}`}>
      {/* Drop Zone */}
      <motion.div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          style={{ display: "none" }}
        />

        <div className="drop-zone-content">
          <div className="drop-icon">
            <FaUpload />
          </div>
          <h3>Upload Medical Reports</h3>
          <p>
            Drag & drop files here, or{" "}
            <span className="browse-link">browse</span>
          </p>
          <div className="supported-formats">
            <span>
              <FaFilePdf /> PDF
            </span>
            <span>
              <FaFileImage /> JPG, PNG
            </span>
            <span>
              <FaScan /> DICOM
            </span>
          </div>
          <p className="max-size">Max file size: {maxSize}MB</p>
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="file-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                className={`file-item ${file.status}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                {/* File Icon */}
                <div className="file-icon">
                  {file.type === "pdf" && <FaFilePdf />}
                  {file.type === "image" && <FaFileImage />}
                  {file.type === "dicom" && <FaScan />}
                  {file.type === "document" && <FaFileMedical />}
                </div>

                {/* File Info */}
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{file.size}</span>
                </div>

                {/* Status */}
                <div className="file-status">
                  {file.status === "pending" && (
                    <span className="status-text">Ready</span>
                  )}
                  {file.status === "uploading" && (
                    <>
                      <FaSpinner className="spinner" />
                      <span className="status-text">
                        {Math.round(file.progress)}%
                      </span>
                    </>
                  )}
                  {file.status === "success" && (
                    <>
                      <FaCheckCircle className="success-icon" />
                      <span className="status-text success">Uploaded</span>
                    </>
                  )}
                  {file.status === "error" && (
                    <>
                      <FaExclamationCircle className="error-icon" />
                      <span className="status-text error">Failed</span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="file-actions">
                  <button
                    className="action-btn view"
                    title="Preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Preview logic
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="action-btn delete"
                    title="Remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Progress Bar */}
                {file.status === "uploading" && (
                  <div className="file-progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {files.length > 0 && !uploading && (
        <motion.button
          className="btn-premium btn-primary full-width upload-btn"
          onClick={handleUpload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaUpload />
          Upload {files.length} File{files.length > 1 ? "s" : ""}
        </motion.button>
      )}

      {/* Uploading State */}
      {uploading && showProgress && (
        <div className="upload-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="progress-text">
            Processing medical reports... {Math.round(uploadProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ReportUpload;
