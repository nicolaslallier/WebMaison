import React, { useState, useRef } from 'react';
import './FileManagement.css';

function FileManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus('');
    setDebugInfo('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading...');
    setDebugInfo('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      console.log('Starting upload to:', 'https://maisonai-echngse9fkcve2hf.canadaeast-01.azurewebsites.net/api/FileUpload');
      console.log('File being uploaded:', selectedFile.name, 'Size:', selectedFile.size);

      const response = await fetch('https://maisonai-echngse9fkcve2hf.canadaeast-01.azurewebsites.net/api/FileUpload', {
        method: 'POST',
        body: formData,
        // Adding headers that might help with CORS
        headers: {
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        // Adding mode and credentials for better CORS handling
        mode: 'cors',
        credentials: 'omit'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        setUploadStatus('File uploaded successfully!');
        setUploadedFiles(prev => [...prev, {
          name: selectedFile.name,
          size: selectedFile.size,
          uploadedAt: new Date().toLocaleString(),
          ...result
        }]);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status, 'Error:', errorText);
        setUploadStatus(`Upload failed: ${response.status} - ${errorText}`);
        setDebugInfo(`Status: ${response.status}, StatusText: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setDebugInfo(`Error type: ${error.name}, Message: ${error.message}`);
      
      // Additional debugging for network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setDebugInfo(prev => prev + '\nThis appears to be a network/CORS issue. Check if the API endpoint is accessible.');
      }
    } finally {
      setUploading(false);
    }
  };

  const testConnection = async () => {
    setDebugInfo('Testing connection...');
    try {
      const response = await fetch('https://maisonai-echngse9fkcve2hf.canadaeast-01.azurewebsites.net/api/FileUpload', {
        method: 'OPTIONS',
        mode: 'cors',
        credentials: 'omit'
      });
      setDebugInfo(`Connection test: Status ${response.status}, CORS headers present: ${response.headers.get('access-control-allow-origin') ? 'Yes' : 'No'}`);
    } catch (error) {
      setDebugInfo(`Connection test failed: ${error.message}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-management">
      <div className="file-management-container">
        <h1>📁 File Management</h1>
        
        <div className="upload-section">
          <h2>Upload Files</h2>
          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-input-label">
              <span className="upload-icon">📤</span>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : 'Choose a file or drag it here'}
              </span>
              {selectedFile && (
                <span className="file-size">
                  Size: {formatFileSize(selectedFile.size)}
                </span>
              )}
            </label>
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="upload-button"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>

            <button
              onClick={testConnection}
              className="test-button"
            >
              Test Connection
            </button>
          </div>
          
          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.includes('successfully') ? 'success' : 'error'}`}>
              {uploadStatus}
            </div>
          )}

          {debugInfo && (
            <div className="debug-info">
              <h4>Debug Information:</h4>
              <pre>{debugInfo}</pre>
            </div>
          )}
        </div>

        <div className="files-section">
          <h2>Uploaded Files</h2>
          {uploadedFiles.length === 0 ? (
            <div className="no-files">
              <span className="no-files-icon">📂</span>
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="files-list">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <span className="file-date">{file.uploadedAt}</span>
                  </div>
                  <div className="file-actions">
                    <button className="action-button download">📥</button>
                    <button className="action-button delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileManagement; 