import api from './api';

export const jobService = {
  // Recruiter - Post a new job
  postJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data.data;
  },

  // Get all jobs (with filters)
  getAllJobs: async (filters) => {
    const response = await api.get('/jobs', { params: filters });
    return response.data.data;
  },

  // Get recruiter's jobs
  getRecruiterJobs: async () => {
    const response = await api.get('/jobs/my');
    return response.data.data;
  },

  // Get job by ID
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data.data;
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    const response = await api.patch(`/jobs/${jobId}`, jobData);
    return response.data.data;
  },

  // Delete job
  deleteJob: async (jobId) => {
    console.log('jobService.deleteJob called with:', jobId);
    const response = await api.delete(`/jobs/${jobId}`);
    console.log('deleteJob response:', response);
    return response.data.data;
  },
};
