import React, { useState } from 'react';
import './App.css';
import UploadComponent from './components/UploadComponent';
import DownloadComponent from './components/DownloadComponent';
import InviteCodeComponent from './components/InviteCodeComponent';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [inviteCode, setInviteCode] = useState(null);

  const handleCodeGenerated = (code) => {
    setInviteCode(code);
    // Automatically switch to the code tab when a file is uploaded
    if (code) {
      setActiveTab('code');
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>🔗 PeerLink</h1>
          <p>Simple P2P File Sharing</p>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload
          </button>
          <button
            className={`tab-button ${activeTab === 'download' ? 'active' : ''}`}
            onClick={() => setActiveTab('download')}
          >
            📥 Download
          </button>
          <button
            className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            🔑 Invite Code
          </button>
        </div>

        <div className="content">
          {activeTab === 'upload' && (
            <UploadComponent onCodeGenerated={handleCodeGenerated} />
          )}
          {activeTab === 'download' && <DownloadComponent />}
          {activeTab === 'code' && <InviteCodeComponent code={inviteCode} />}
        </div>
      </div>
    </div>
  );
}

export default App;
