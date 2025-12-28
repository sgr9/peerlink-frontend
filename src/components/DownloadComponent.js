import React, { useState } from 'react';
import './DownloadComponent.css';

function DownloadComponent() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const handleDownload = async () => {
    if (!code.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setDownloading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/download/${code}`);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          throw new Error('Invite code not found. Check if the code is correct.');
        }
        if (response.status === 0 || response.status >= 500) {
          throw new Error('Backend server is not responding. Please check the backend URL.');
        }
        throw new Error(errorText || `Download failed (${response.status})`);
      }

      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded-file';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setCode('');
      setError(null);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Network error: Unable to reach backend. Check API_URL configuration.');
      } else {
        setError(`Download failed: ${err.message}`);
      }
      console.error('Download error:', err);
    } finally {
      setLoading(false);
      setDownloading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      setError('Failed to paste from clipboard');
    }
  };

  return (
    <div className="download-component">
      <div className="input-group">
        <label htmlFor="code-input">Enter Invite Code:</label>
        <div className="input-wrapper">
          <input
            id="code-input"
            type="text"
            placeholder="Enter the 5-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
            className="code-input"
          />
          <button
            onClick={handlePaste}
            disabled={loading}
            className="paste-button"
            title="Paste from clipboard"
          >
            📋
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleDownload}
        disabled={!code.trim() || loading}
        className="download-button"
      >
        {downloading ? (
          <>
            <span className="spinner">⬇️</span> Downloading...
          </>
        ) : (
          '📥 Download File'
        )}
      </button>

      <div className="info-box">
        <p className="info-title">💡 How to use:</p>
        <ol className="info-steps">
          <li>Get the invite code from your peer</li>
          <li>Enter it in the code field above</li>
          <li>Click "Download File" to start the download</li>
        </ol>
      </div>
    </div>
  );
}

export default DownloadComponent;
