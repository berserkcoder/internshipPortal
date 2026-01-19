import api from './api';

export const resumeService = {
  // Upload resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/resume/uploadResume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get candidate's resumes
  getCandidateResumes: async () => {
    const response = await api.get('/resume/me');
    return response.data.data;
  },

  // Delete resume
  deleteResume: async (resumeId) => {
    console.log('resumeService.deleteResume called with:', resumeId);
    const response = await api.delete(`/resume/${resumeId}`);
    console.log('deleteResume response:', response);
    return response.data.data;
  },
};
