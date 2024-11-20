import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  // Tracks the token of the authenticated user
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    async register(username: string, password: string) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_ENDPOINT}/register`, { username, password });
      } catch (error: any) {
        console.error('Registration failed:', error.response?.data || error);
        throw error;
      }
    },
    async login(username: string, password: string) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_ENDPOINT}/login`, { username, password });
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
      } catch (error: any) {
        console.error('Login failed:', error.response?.data || error);
        throw error;
      }
    },
    logout() {
      this.token = '';
      localStorage.removeItem('token');
    },
  },
  getters: {
    // Checks if the user is authenticated by verifying if the token exists
    isAuthenticated: (state) => !!state.token,
  },
});
