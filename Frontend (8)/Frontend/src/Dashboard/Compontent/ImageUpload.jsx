import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaSpinner, FaCheck } from 'react-icons/fa';

const ImageUpload = ({ onUploadSuccess, currentImage, label }) => {
  const [uploading, setUploading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await axios.post(`${baseURL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        onUploadSuccess(res.data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>{label}</label>}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {currentImage && (
          <img 
            src={currentImage.startsWith('/') || !currentImage.includes('://') ? (currentImage.startsWith('http') ? currentImage : `${baseURL}${currentImage.startsWith('/') ? '' : '/api/uploads/'}${currentImage}`) : currentImage} 
            alt="Preview" 
            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }} 
          />
        )}
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 1rem', 
          background: uploading ? '#94a3b8' : '#3b82f6', 
          color: 'white', 
          borderRadius: '0.375rem', 
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {uploading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaUpload />}
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} accept="image/*" />
        </label>
        
        {currentImage && <span style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>{currentImage}</span>}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ImageUpload;
