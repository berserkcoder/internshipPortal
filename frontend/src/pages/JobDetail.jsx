import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { resumeService } from '../services/resumeService';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';
import { MapPin, Briefcase, ArrowLeft, Calendar } from 'lucide-react';
import '../styles/job-detail.css';

export const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJob();
    if (user?.role === 'candidate') {
      fetchResumes();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await jobService.getJobById(jobId);
      setJob(response);
      setHasApplied(response.alreadyApplied || false);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job details');
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await resumeService.getCandidateResumes();
      setResumes(Array.isArray(response) ? response : [response]);
      if (response && (Array.isArray(response) ? response.length > 0 : true)) {
        setSelectedResume(Array.isArray(response) ? response[0]._id : response._id);
      }
    } catch (err) {
      console.error('Failed to load resumes');
    }
  };

  const handleApply = async () => {
    if (!selectedResume) {
      setError('Please select a resume');
      return;
    }

    setApplying(true);
    try {
      await applicationService.applyForJob(jobId, selectedResume);
      setSuccess('Application submitted successfully!');
      setHasApplied(true);
      setTimeout(() => navigate('/candidate/applications'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading job details...</p></div>;
  if (!job) return <div className="container mt-4"><p>Job not found</p></div>;

  return (
    <div className="job-detail-container">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="job-detail-grid">
          <div className="job-info">
            <Card>
              <div className="job-header-detail">
                <h1>{job.title}</h1>
                <p className="company-name">{job.companyName}</p>
              </div>

              <div className="job-meta-detail">
                <div className="meta-item-detail">
                  <MapPin size={20} />
                  <span>{job.location} {job.isRemote && '(Remote)'}</span>
                </div>
                <div className="meta-item-detail">
                  <Briefcase size={20} />
                  <span>{job.jobType}</span>
                </div>
                {job.experienceLevel && (
                  <div className="meta-item-detail">
                    <Calendar size={20} />
                    <span>{job.experienceLevel}</span>
                  </div>
                )}
              </div>

              <div className="job-salary">
                {job.salaryRange && (
                  <div className="salary-info">
                    <strong>Salary Range:</strong> {job.salaryRange}
                  </div>
                )}
              </div>

              <div className="job-description-detail">
                <h3>Job Description</h3>
                <p>{job.description}</p>
              </div>

              <div className="required-skills">
                <h3>Required Skills</h3>
                <div className="skills-list">
                  {job.requiredSkills && job.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="job-stats">
                <div className="stat">
                  <span className="stat-label">Applications</span>
                  <span className="stat-value">{job.applicationCount || 0}</span>
                </div>
              </div>
            </Card>
          </div>

          {user?.role === 'candidate' && (
            <div className="apply-section">
              <Card>
                <h3>Apply for this Job</h3>
                {hasApplied ? (
                  <Alert type="success" message="You have already applied for this job!" />
                ) : resumes.length > 0 ? (
                  <>
                    <div className="resume-selector">
                      <label>Select Resume</label>
                      <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
                        <option value="">Choose a resume...</option>
                        {resumes.map((resume) => (
                          <option key={resume._id} value={resume._id}>
                            {resume.fileName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={handleApply}
                      loading={applying}
                      disabled={!selectedResume || hasApplied}
                      fullWidth
                    >
                      Apply Now
                    </Button>
                  </>
                ) : (
                  <div className="no-resumes">
                    <p>You haven't uploaded any resumes yet.</p>
                    <p style={{fontSize: '12px', marginTop: '10px'}}>To apply for jobs, you need to upload a resume first.</p>
                    <Button
                      onClick={() => navigate('/candidate/resumes')}
                      fullWidth
                      style={{marginTop: '10px'}}
                    >
                      Upload Resume
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
