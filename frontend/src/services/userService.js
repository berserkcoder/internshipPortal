import api from './api';

export const userService = {
  // Get all users (Admin)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data.data;
  },

  // Get pending recruiters/admins (Admin)
  getPendingUsers: async () => {
    const response = await api.get('/users/pending');
    return response.data.data;
  },

  // Approve user (Admin)
  approveUser: async (userId) => {
    const response = await api.post(`/users/${userId}/approve`);
    return response.data.data;
  },

  // Reject user (Admin)
  rejectUser: async (userId) => {
    const response = await api.post(`/users/${userId}/reject`);
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.post('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
