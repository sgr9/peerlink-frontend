import React, { useState, useRef } from 'react';
import './UploadComponent.css';

function UploadComponent({ onCodeGenerated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [port, setPort] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file to:', `${API_URL}/upload`);
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(errorText || 'Upload failed');
      }

      const data = await response.json();
      console.log('Parsed response data:', data);
      
      if (!data.port) {
        throw new Error('No port returned from server');
      }
      
      setPort(data.port);
      onCodeGenerated(data.port);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPort(null);
    setError(null);
    onCodeGenerated(null);  // Reset the code in parent component
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
      setError(null);
    }
  };

  const handleUploadAreaClick = () => {
    if (fileInputRef.current && !loading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-component">
      {!port ? (
        <>
          <div 
            className="upload-area"
            onClick={handleUploadAreaClick}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="file-input"
              disabled={loading}
            />
            <div className="upload-label">
              <div className="upload-icon">📁</div>
              <p className="upload-text">
                {file ? file.name : 'Click to select a file or drag and drop'}
              </p>
              {file && (
                <p className="file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="upload-button"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </>
      ) : (
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>File Uploaded Successfully!</h2>
          <p className="success-text">Share this code with your peer:</p>
          <div className="code-display">
            <code>{port}</code>
            <button
              onClick={() => navigator.clipboard.writeText(port)}
              className="copy-button"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          <p className="info-text">
            Your peer can use this code to download the file
          </p>
          <button onClick={handleReset} className="reset-button">
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadComponent;
