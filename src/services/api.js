const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  signup: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    return response.json();
  },

  getLeaderboard: async () => {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    return response.json();
  },

  getRewards: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/rewards/${userId}`);
    return response.json();
  },
};