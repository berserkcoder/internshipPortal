import api from './api';

export const applicationService = {
  // Candidate - Apply for a job
  applyForJob: async (jobId, resumeId) => {
    const response = await api.post(`/applications/${jobId}`, { resumeId });
    return response.data.data;
  },

  // Get candidate's applications
  getCandidateApplications: async (filters) => {
    const response = await api.get('/applications/me', { params: filters });
    return response.data.data.applications || [];
  },

  // Get job's applications (Recruiter)
  getJobApplications: async (jobId, filters) => {
    const response = await api.get(`/applications/job/${jobId}`, { params: filters });
    return response.data.data;
  },

  // Get all applications (Admin)
  getAllApplications: async (filters) => {
    const response = await api.get('/applications', { params: filters });
    return response.data.data;
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data.data;
  },
};
