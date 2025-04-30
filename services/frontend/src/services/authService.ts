import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your auth service URL

const register = async (userData: any) => {
  const response = await axios.post(API_URL + '/register', userData);
  return response.data;
};

const login = async (userData: any) => {
  const response = await axios.post(API_URL + '/login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }

  return null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;