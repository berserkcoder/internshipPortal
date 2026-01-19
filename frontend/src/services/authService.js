import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response;
  },

  signup: async (data) => {
    const response = await api.post('/users/register', data);
    const { accessToken, refreshToken, user } = response.data.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};
