const path = require('path');

/**
 * Storage configuration
 * Handles file paths and URLs for uploaded files
 */

// Base URL for serving files
const getBaseUrl = () => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 5000;
  
  if (process.env.NODE_ENV === 'production' && process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  return `${protocol}://${host}:${port}`;
};

// Get public URL for uploaded file
const getFileUrl = (filepath) => {
  if (!filepath) return null;
  
  // If already a full URL, return as is
  if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
    return filepath;
  }
  
  // Convert local path to URL
  const relativePath = filepath.replace(/\\/g, '/').split('/uploads/')[1];
  return `${getBaseUrl()}/uploads/${relativePath}`;
};

// Get local file path from URL
const getLocalPath = (fileUrl) => {
  if (!fileUrl) return null;
  
  // If already a local path, return as is
  if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
    return fileUrl;
  }
  
  // Extract relative path from URL
  const urlObj = new URL(fileUrl);
  const relativePath = urlObj.pathname.replace('/uploads/', '');
  return path.join(__dirname, '../../uploads', relativePath);
};

module.exports = {
  getBaseUrl,
  getFileUrl,
  getLocalPath,
};

