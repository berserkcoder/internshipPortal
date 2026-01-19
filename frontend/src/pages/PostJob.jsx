import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';
import '../styles/post-job.css';

export const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    companyName: '',
    jobType: 'full-time',
    isRemote: false,
    experienceLevel: 'entry-level',
    salaryRange: '',
    requiredSkills: '',
    expiresAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Validate date is in the future
    if (name === 'expiresAt' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setError('Expiration date must be in the future');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Submit handler called with formData:', formData);

    try {
      const skills = formData.requiredSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (skills.length === 0) {
        setError('Please add at least one skill');
        setLoading(false);
        return;
      }

      console.log('Posting job with skills:', skills);
      const result = await jobService.postJob({
        ...formData,
        requiredSkills: skills,
        status: 'open', // Set status to open so it's visible to candidates
      });
      console.log('Job posted successfully:', result);
      setSuccess('Job posted successfully!');
      setTimeout(() => navigate('/recruiter/jobs'), 1500);
    } catch (err) {
      console.error('Post job error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="container">
        <h1>Post a New Job</h1>

        <Card className="post-job-card">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          <form onSubmit={handleSubmit}>
            <Input
              label="Job Title *"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Frontend Developer, UI/UX Designer"
              required
            />

            <Input
              label="Company Name *"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your company name"
              required
            />

            <div className="form-group">
              <label className="input-label">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities, requirements, what you're looking for in candidates..."
                rows={6}
                className="textarea"
                required
              />
            </div>

            <Input
              label="Location *"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA"
              required
            />

            <div className="form-row">
              <div className="form-group">
                <label className="input-label">Job Type *</label>
                <select 
                  name="jobType" 
                  value={formData.jobType} 
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Experience Level</label>
                <select 
                  name="experienceLevel" 
                  value={formData.experienceLevel} 
                  onChange={handleChange}
                  className="input"
                >
                  <option value="entry-level">Entry-level</option>
                  <option value="mid-level">Mid-level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
              />
              <label htmlFor="isRemote">This is a remote position</label>
            </div>

            <Input
              label="Salary Range"
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g., $50,000 - $80,000 per year"
            />

            <div className="form-group">
              <label className="input-label">Required Skills * (comma-separated)</label>
              <textarea
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB, JavaScript"
                rows={3}
                className="textarea"
                required
              />
              <small>Enter each skill separated by a comma</small>
            </div>

            <Input
              label="Job Expiration Date *"
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />

            <div className="form-actions">
              <Button type="submit" loading={loading} fullWidth>
                Post Job
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/recruiter/jobs')}
                style={{backgroundColor: '#6c757d'}}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
