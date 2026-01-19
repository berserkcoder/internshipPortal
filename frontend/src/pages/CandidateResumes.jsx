import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { FileText, Upload, Trash2, Download } from 'lucide-react';
import '../styles/resumes.css';

export const CandidateResumes = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await resumeService.getCandidateResumes();
      setResume(response);
    } catch (err) {
      console.log('No resume uploaded yet');
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      await resumeService.uploadResume(file);
      setSuccess('Resume uploaded successfully!');
      fetchResume();
      // Reset input
      e.target.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume || !window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      console.log('Delete handler called with resume ID:', resume._id);
      const result = await resumeService.deleteResume(resume._id);
      console.log('Delete response:', result);
      setSuccess('Resume deleted successfully');
      setResume(null);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Delete error full:', err);
      console.error('Delete error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to delete resume');
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading...</p></div>;

  return (
    <div className="resumes-container">
      <div className="container">
        <h1>My Resumes</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <Card className="upload-section">
          <div className="upload-box">
            <Upload size={32} />
            <h3>Upload Your Resume</h3>
            <p>PDF or Word document (Max 5MB)</p>
            <label htmlFor="resume-input" className="btn btn-primary">
              {resume ? 'Update Resume' : 'Upload Resume'}
            </label>
            <input
              id="resume-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading && <p style={{marginTop: '10px', fontSize: '12px'}}>Uploading...</p>}
          </div>
        </Card>

        {resume ? (
          <div className="resumes-list">
            <Card className="resume-item">
              <div className="resume-header">
                <div className="resume-info">
                  <FileText size={32} />
                  <div>
                    <h3>{resume.fileName}</h3>
                    <p>{(resume.fileSize / 1024).toFixed(2)} KB</p>
                    <p style={{fontSize: '12px', color: '#666'}}>Uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="resume-actions">
                  <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                    <Download size={16} /> Download
                  </a>
                  <Button 
                    onClick={handleDelete}
                    size="small"
                    style={{backgroundColor: '#dc3545'}}
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </div>
            </Card>

            <div className="resume-usage">
              <h3>Using This Resume</h3>
              <p>This resume will be used when you apply for jobs. You can update it anytime.</p>
            </div>
          </div>
        ) : (
          <div className="no-resumes">
            <FileText size={48} />
            <h2>No Resume Uploaded</h2>
            <p>Upload your resume to start applying for internships!</p>
            <label htmlFor="resume-input2" className="btn btn-primary">
              Upload Resume Now
            </label>
            <input
              id="resume-input2"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
