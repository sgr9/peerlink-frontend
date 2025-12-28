import React, { useState } from 'react';
import './InviteCodeComponent.css';

function InviteCodeComponent({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (method) => {
    if (!code) return;
    
    // We update the message to reflect that this is a unique ID
    let shareText = `Use this PeerLink ID to download my file: ${code}`;
    let shareUrl = '';

    switch (method) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(code)}&text=${encodeURIComponent('PeerLink File ID')}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=PeerLink File Sharing ID&body=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="invite-code-component">
      {code ? (
        <div className="code-container">
          <h2>Share Your File ID</h2>
          <p className="subtitle">Your peer needs this unique ID to find and download your file.</p>

          <div className="code-box">
            {/* Added a special class to handle long UUID text wrapping */}
            <div className="code-display uuid-text">{code}</div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleCopy}
              className={`action-button copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? '✅ ID Copied!' : '📋 Copy ID'}
            </button>
          </div>

          <div className="share-section">
            <p className="share-title">Send via:</p>
            <div className="share-buttons">
              <button
                onClick={() => handleShare('whatsapp')}
                className="share-button whatsapp"
              >
                📱 WhatsApp
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="share-button telegram"
              >
                ✈️ Telegram
              </button>
              <button
                onClick={() => handleShare('email')}
                className="share-button email"
              >
                📧 Email
              </button>
            </div>
          </div>

          <div className="security-info">
            <p>
              <strong>🔒 Persistence:</strong> This ID is active as long as the backend server keeps the file in its temporary storage.
            </p>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No Active Share</h2>
          <p>Upload a file first to generate a unique ID</p>
          <p className="hint">Go to the "Upload" tab to get started</p>
        </div>
      )}
    </div>
  );
}

export default InviteCodeComponent;
