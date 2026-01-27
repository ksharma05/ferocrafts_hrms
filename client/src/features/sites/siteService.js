import axiosInstance from '../../services/axiosInstance';

const API_URL = '/sites/';

// Get all sites
const getSites = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data.data;
};

// Create site
const createSite = async (siteData) => {
  const response = await axiosInstance.post(API_URL, siteData);
  return response.data.data;
};

// Update site
const updateSite = async (id, siteData) => {
  const response = await axiosInstance.put(API_URL + id, siteData);
  return response.data.data;
};

// Assign employee to site
const assignEmployeeToSite = async (assignmentData) => {
  const response = await axiosInstance.post(API_URL + 'assign', assignmentData);
  return response.data.data;
};

// Get current site (for employee)
const getCurrentSite = async () => {
  const response = await axiosInstance.get(API_URL + 'current-site');
  return response.data.data;
};

// Get work history (for employee)
const getWorkHistory = async () => {
  const response = await axiosInstance.get(API_URL + 'work-history');
  return response.data.data;
};

// Get employees assigned to a site
const getSiteEmployees = async (siteId) => {
  const response = await axiosInstance.get(API_URL + `${siteId}/employees`);
  return response.data.data;
};

const siteService = {
  getSites,
  createSite,
  updateSite,
  assignEmployeeToSite,
  getCurrentSite,
  getWorkHistory,
  getSiteEmployees,
};

export default siteService;
