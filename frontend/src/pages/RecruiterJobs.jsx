import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Link } from 'react-router-dom';
import { Trash2, Users, Eye } from 'lucide-react';
import '../styles/recruiter-jobs.css';

export const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobService.getRecruiterJobs();
      setJobs(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    console.log('Delete handler called for job:', jobId);
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      console.log('Calling deleteJob API for:', jobId);
      const result = await jobService.deleteJob(jobId);
      console.log('Delete response:', result);
      setJobs(jobs.filter(job => job._id !== jobId));
      setSuccess('Job deleted successfully');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Delete error full:', err);
      console.error('Delete error response:', err.response);
      console.error('Delete error message:', err.response?.data?.message);
      setError(err.response?.data?.message || err.message || 'Failed to delete job');
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading jobs...</p></div>;

  return (
    <div className="recruiter-jobs-container">
      <div className="container">
        <div className="page-header">
          <h1>My Job Postings</h1>
          <Link to="/recruiter/post-job" className="btn btn-primary">
            Post New Job
          </Link>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {jobs.length === 0 ? (
          <div className="no-data">
            <Users size={48} />
            <h2>No jobs posted yet</h2>
            <p>Create your first job posting to attract candidates</p>
            <Link to="/recruiter/post-job" className="btn btn-primary" style={{marginTop: '20px'}}>
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <Card key={job._id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="job-location">{job.location} {job.isRemote && '(Remote)'}</p>
                  </div>
                  <span className={`status-badge status-${job.status}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>

                <p className="job-description">{job.description.substring(0, 80)}...</p>

                <div className="job-stats">
                  <div className="stat">
                    <Users size={16} />
                    <span>{job.applicationCount || 0} applications</span>
                  </div>
                  <div className="stat">
                    <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {job.salaryRange && (
                  <div className="salary-info">
                    <strong>{job.salaryRange}</strong>
                  </div>
                )}

                <div className="job-card-actions">
                  <Link to={`/recruiter/job-applicants/${job._id}`} className="btn btn-sm btn-secondary">
                    <Eye size={14} /> View Applicants
                  </Link>
                  <Button
                    size="small"
                    onClick={() => handleDelete(job._id)}
                    style={{backgroundColor: '#e74c3c'}}
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
