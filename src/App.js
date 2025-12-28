import React, { useState } from 'react';
import './App.css';
import UploadComponent from './components/UploadComponent';
import DownloadComponent from './components/DownloadComponent';
import InviteCodeComponent from './components/InviteCodeComponent';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [fileId, setFileId] = useState(null); // Rename state for clarity

  const handleFileIdGenerated = (id) => {
    setFileId(id);
    // Automatically switch to the ID display tab when a file is uploaded
    if (id) {
      setActiveTab('share'); // Renamed tab key to 'share' for better context
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>🔗 PeerLink</h1>
          <p>Simple HTTP File Sharing</p> {/* Updated description */}
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
            className={`tab-button ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            🔑 File ID {/* Terminology: Use "File ID" instead of "Invite Code" */}
          </button>
        </div>

        <div className="content">
          {activeTab === 'upload' && (
            <UploadComponent onCodeGenerated={handleFileIdGenerated} />
          )}
          {activeTab === 'download' && <DownloadComponent />}
          {activeTab === 'share' && <InviteCodeComponent code={fileId} />}
        </div>
      </div>
    </div>
  );
}

export default App;
