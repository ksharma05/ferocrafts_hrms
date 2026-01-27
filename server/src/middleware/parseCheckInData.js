/**
 * Middleware to parse check-in data before validation
 * Handles FormData location string parsing and file upload preparation
 */

const parseCheckInData = (req, res, next) => {
  // Validate that a file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Selfie is required for check-in',
    });
  }

  // Parse location if it's a string (from FormData JSON.stringify)
  if (req.body.location && typeof req.body.location === 'string') {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Invalid location format. Location must be a valid JSON string.',
      });
    }
  }

  // Validate location structure
  if (!req.body.location || typeof req.body.location !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Location is required and must be a valid object',
    });
  }

  if (req.body.location.type !== 'Point' || !Array.isArray(req.body.location.coordinates) || req.body.location.coordinates.length !== 2) {
    return res.status(400).json({
      success: false,
      error: 'Location must be a Point with coordinates [longitude, latitude]',
    });
  }

  next();
};

module.exports = parseCheckInData;

