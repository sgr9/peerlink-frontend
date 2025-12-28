import React, { useState, useRef } from 'react';
import './UploadComponent.css';

function UploadComponent({ onCodeGenerated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState(null); // Changed from port to fileId
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

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status >= 500) {
          throw new Error('Server error. The backend might be starting up or misconfigured.');
        }
        throw new Error(errorText || `Upload failed (${response.status})`);
      }

      const data = await response.json();
      
      // Update: Check for fileId instead of port
      if (!data.fileId) {
        throw new Error('The server did not return a valid File ID');
      }
      
      setFileId(data.fileId);
      onCodeGenerated(data.fileId); 
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Network error: Backend is unreachable. Ensure the Railway URL is correct.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileId(null);
    setError(null);
    onCodeGenerated(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers remain the same...
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  return (
    <div className="upload-component">
      {!fileId ? (
        <>
          <div 
            className="upload-area"
            onClick={() => !loading && fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="file-input"
              style={{ display: 'none' }}
              disabled={loading}
            />
            <div className="upload-label">
              <div className="upload-icon">📁</div>
              <p className="upload-text">
                {file ? file.name : 'Click to select or drag and drop'}
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
            {loading ? (
                <>
                    <span className="spinner">⏳</span> Uploading...
                </>
            ) : 'Upload File'}
          </button>
        </>
      ) : (
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>Ready to Share!</h2>
          <p className="success-text">Copy this **File ID** and send it to your peer:</p>
          
          <div className="code-display">
            <code className="uuid-text">{fileId}</code>
            <button
              onClick={() => navigator.clipboard.writeText(fileId)}
              className="copy-button"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          
          <p className="info-text">
            They can paste this ID into their Download tab to get the file.
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
