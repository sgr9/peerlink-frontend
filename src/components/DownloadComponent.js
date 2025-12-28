import React, { useState } from 'react';
import './DownloadComponent.css';

function DownloadComponent() {
  const [code, setCode] = useState(''); // This now stores the UUID/FileID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Ensure this points to your Railway URL in production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const handleDownload = async () => {
    if (!code.trim()) {
      setError('Please enter a valid File ID');
      return;
    }

    setLoading(true);
    setDownloading(true);
    setError(null);

    try {
      // The backend now expects /download/{uuid}
      const response = await fetch(`${API_URL}/download/${code.trim()}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('File not found. The link might be expired or the ID is incorrect.');
        }
        const errorText = await response.text();
        throw new Error(errorText || `Download failed (${response.status})`);
      }

      // Filename extraction logic remains the same - this is good!
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded-file';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setCode(''); // Clear after success
      setError(null);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Connection Error: Cannot reach the backend. Check if your Railway server is awake.');
      } else {
        setError(err.message);
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
      // Basic check to see if it looks like a UUID or at least isn't empty
      setCode(text.trim());
    } catch (err) {
      setError('Failed to paste from clipboard');
    }
  };

  return (
    <div className="download-component">
      <div className="input-group">
        <label htmlFor="code-input">Enter File ID:</label>
        <div className="input-wrapper">
          <input
            id="code-input"
            type="text"
            // UPDATED: Changed placeholder from 5-digit to File ID
            placeholder="Paste the unique File ID here"
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
          <li>Ask your peer for the unique **File ID**</li>
          <li>Paste the long ID into the field above</li>
          <li>Click "Download" to fetch the file directly via HTTP</li>
        </ol>
      </div>
    </div>
  );
}

export default DownloadComponent;
