import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Download, ArrowLeft } from 'lucide-react';
import '../styles/job-applicants.css';

export const RecruiterJobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await applicationService.getJobApplications(jobId);
      setJobData(response.jobId);
      setApplications(Array.isArray(response.applications) ? response.applications : []);
    } catch (err) {
      console.error('Fetch applications error:', err);
      setError(err.response?.data?.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      setSuccess('Application status updated successfully');
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': '#3498db',
      'shortlisted': '#f39c12',
      'rejected': '#e74c3c',
      'hired': '#27ae60',
    };
    return colors[status?.toLowerCase()] || '#95a5a6';
  };

  if (loading) return <div className="container mt-4"><p>Loading applicants...</p></div>;

  return (
    <div className="job-applicants-container">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        <h1>Job Applicants</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {applications.length === 0 ? (
          <Card>
            <div style={{textAlign: 'center', padding: '40px'}}>
              <p>No applicants yet</p>
            </div>
          </Card>
        ) : (
          <div className="applicants-list">
            <div className="applicants-summary">
              <p>Total Applications: <strong>{applications.length}</strong></p>
            </div>

            {applications.map((app) => (
              <Card key={app.applicationId} className="applicant-card">
                <div className="applicant-header">
                  <div className="applicant-info">
                    <h3>{app.candidate.name}</h3>
                    <p className="email">{app.candidate.email}</p>
                  </div>
                  <span 
                    className={`status-badge`}
                    style={{backgroundColor: getStatusColor(app.status)}}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                <div className="applicant-details">
                  <p><strong>Applied on:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>

                <div className="applicant-actions">
                  {app.resume && (
                    <a 
                      href={app.resume.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm btn-secondary"
                    >
                      <Download size={14} /> View Resume
                    </a>
                  )}

                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.applicationId, e.target.value)}
                    className="status-select"
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
