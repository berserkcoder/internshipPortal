import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import '../styles/applications.css';

export const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await applicationService.getCandidateApplications({ status: filter || undefined });
      setApplications(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'applied': 'status-applied',
      'shortlisted': 'status-shortlisted',
      'rejected': 'status-rejected',
      'hired': 'status-hired',
    };
    return statusStyles[status?.toLowerCase()] || '';
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

  if (loading) return <div className="container mt-4"><p>Loading applications...</p></div>;

  return (
    <div className="applications-container">
      <div className="container">
        <h1>My Applications</h1>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === '' ? 'active' : ''}`}
            onClick={() => setFilter('')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'applied' ? 'active' : ''}`}
            onClick={() => setFilter('applied')}
          >
            Applied
          </button>
          <button
            className={`filter-btn ${filter === 'shortlisted' ? 'active' : ''}`}
            onClick={() => setFilter('shortlisted')}
          >
            Shortlisted
          </button>
          <button
            className={`filter-btn ${filter === 'hired' ? 'active' : ''}`}
            onClick={() => setFilter('hired')}
          >
            Hired
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {applications.length === 0 ? (
          <div className="no-data">
            <Briefcase size={48} />
            <h2>No applications yet</h2>
            <p>You haven't applied to any jobs yet. Start browsing jobs now!</p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <Card key={app.applicationId} className="application-card">
                <div className="app-header">
                  <div>
                    <h3>{app.job?.title || 'Job Posting'}</h3>
                    <p className="company-name">{app.job?.companyName || 'Company'}</p>
                    <div className="job-status-info">
                      <p><strong>Job Status:</strong> {app.job?.status.charAt(0).toUpperCase() + app.job?.status.slice(1) || "active"}</p>
                    </div>
                  </div>
                  <span 
                    className={`status-badge ${getStatusBadge(app.status)}`}
                    style={{backgroundColor: getStatusColor(app.status)}}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                <div className="app-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="app-status-info">
                  <p><strong>Application Status:</strong> {app.status.charAt(0).toUpperCase() + app.status.slice(1)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
