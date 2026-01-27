import axiosInstance from '../../services/axiosInstance';

const API_URL = '/payouts/';

// Get payout history
const getPayoutHistory = async () => {
  const response = await axiosInstance.get(API_URL + 'history');
  return response.data.data;
};

// Generate payouts
const generatePayouts = async (generateData) => {
  const response = await axiosInstance.post(API_URL + 'generate', generateData);
  return response.data;
};

// Get payout slip
const getPayoutSlip = async (id) => {
  const response = await axiosInstance.get(API_URL + id + '/slip');
  return response.data.data;
};

const payoutService = {
  getPayoutHistory,
  generatePayouts,
  getPayoutSlip,
};

export default payoutService;
