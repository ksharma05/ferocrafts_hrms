import axiosInstance from './axiosInstance';

const API_URL = '/auth/';

// Login user
const login = async (userData) => {
  const response = await axiosInstance.post(API_URL + 'login', userData);

  // Token is now in httpOnly cookie, no need to store in localStorage
  // Only store non-sensitive user data if returned
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Register user (Admin/Manager only)
const register = async (userData) => {
  const response = await axiosInstance.post(API_URL + 'register', userData);
  return response.data;
};

// Logout user
const logout = async () => {
  try {
    await axiosInstance.get(API_URL + 'logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem('user');
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
