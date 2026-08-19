import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user_info', JSON.stringify(response.data));
    }
    return response.data;
  },

  async register(name, email, password, role, studentId) {
    const response = await api.post('/auth/register', { name, email, password, role, studentId });
    // Do not auto-login the user after registration as per user request
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user_info');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('jwt_token');
  }
};
