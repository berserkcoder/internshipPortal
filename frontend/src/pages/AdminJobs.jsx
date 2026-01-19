import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { MapPin, DollarSign, User, Calendar } from 'lucide-react';
import '../styles/admin-jobs.css';

export const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs();
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-4">Loading jobs...</div>;

  return (
    <div className="admin-jobs-container">
      <div className="container">
        <h1>All Jobs</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {jobs.length === 0 ? (
          <Card>
            <p className="text-center">No jobs posted yet</p>
          </Card>
        ) : (
          <div className="jobs-grid-admin">
            {jobs.map((job) => (
              <Card key={job._id} className="job-card-admin">
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <span className="recruiter-name">
                    Posted by {job.recruiter.company || `${job.recruiter.firstName} ${job.recruiter.lastName}`}
                  </span>
                </div>

                <div className="job-card-meta">
                  <div className="meta">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="meta">
                    <DollarSign size={16} />
                    ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                  </div>
                </div>

                <p className="job-description">{job.description.substring(0, 100)}...</p>

                <div className="job-stats">
                  <div className="stat">
                    <User size={16} />
                    <span>{job.applicants?.length || 0} applicants</span>
                  </div>
                  <div className="stat">
                    <Calendar size={16} />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
