import axiosInstance from '../../services/axiosInstance';

const API_URL = '/employees/';

// Get all employees
const getEmployees = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data.data;
};

// Get single employee
const getEmployee = async (id) => {
  const response = await axiosInstance.get(API_URL + id);
  return response.data.data;
};

// Create employee
const createEmployee = async (employeeData) => {
  const response = await axiosInstance.post(API_URL, employeeData);
  return response.data.data;
};

// Update employee
const updateEmployee = async (id, employeeData) => {
  const response = await axiosInstance.put(API_URL + id, employeeData);
  return response.data.data;
};

// Delete employee
const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(API_URL + id);
  return response.data.data;
};

const employeeService = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

export default employeeService;
