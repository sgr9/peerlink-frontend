import React, { useState } from 'react';
import './InviteCodeComponent.css';

function InviteCodeComponent({ code }) {
  const [copied, setCopied] = useState(false);
  const [sharedMethod, setSharedMethod] = useState(null);

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
    setSharedMethod(method);
    let shareUrl = '';
    let shareText = `Here's my file sharing code: ${code}`;

    switch (method) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${code}&text=${encodeURIComponent('File sharing code')}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=File Sharing Code&body=${encodeURIComponent(shareText)}`;
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
          <h2>Share Your Code</h2>
          <p className="subtitle">Share this code with your peer to let them download the file</p>

          <div className="code-box">
            <div className="code-display">{code}</div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleCopy}
              className={`action-button copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
          </div>

          <div className="share-section">
            <p className="share-title">Or share via:</p>
            <div className="share-buttons">
              <button
                onClick={() => handleShare('whatsapp')}
                className="share-button whatsapp"
                title="Share via WhatsApp"
              >
                📱 WhatsApp
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="share-button telegram"
                title="Share via Telegram"
              >
                ✈️ Telegram
              </button>
              <button
                onClick={() => handleShare('email')}
                className="share-button email"
                title="Share via Email"
              >
                📧 Email
              </button>
            </div>
          </div>

          <div className="security-info">
            <p>
              <strong>🔒 Security Tip:</strong> This code only works while your file is being shared. 
              It will expire once you stop the server or restart the application.
            </p>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No Active Share</h2>
          <p>Upload a file first to generate an invite code</p>
          <p className="hint">Go to the "Upload" tab to share a file</p>
        </div>
      )}
    </div>
  );
}

export default InviteCodeComponent;
