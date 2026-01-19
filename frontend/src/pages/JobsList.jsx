import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import '../styles/jobs.css';

export const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ title: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobService.getAllJobs(filters);
      setJobs(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="container mt-4"><p>Loading jobs...</p></div>;

  return (
    <div className="jobs-container">
      <div className="container">
        <h1>Available Jobs</h1>

        <div className="jobs-filters">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by title..."
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Filter by location..."
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {jobs.length === 0 ? (
          <div className="no-data">
            <Briefcase size={48} />
            <h2>No jobs found</h2>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                <Card className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="job-type-badge">{job.jobType}</span>
                  </div>
                  <p className="company-name">{job.companyName}</p>
                  <p className="job-description">{job.description.substring(0, 100)}...</p>
                  
                  <div className="job-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{job.location} {job.isRemote && '(Remote)'}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="meta-item">
                        <Briefcase size={16} />
                        <span>{job.salaryRange}</span>
                      </div>
                    )}
                  </div>

                  <div className="job-skills">
                    {job.requiredSkills && job.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                    {job.requiredSkills && job.requiredSkills.length > 3 && (
                      <span className="skill-tag">+{job.requiredSkills.length - 3}</span>
                    )}
                  </div>

                  <div className="job-footer">
                    <div className="applications-count">
                      <Clock size={14} /> {job.applicationCount || 0} applications
                    </div>
                    <button className="btn btn-sm btn-primary">View Details</button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
