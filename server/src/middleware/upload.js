const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Multer configuration for file uploads
 * Handles selfies and document uploads with validation
 */

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
const selfiesDir = path.join(uploadDir, 'selfies');
const documentsDir = path.join(uploadDir, 'documents');
const profilePicturesDir = path.join(uploadDir, 'profile-pictures');

[uploadDir, selfiesDir, documentsDir, profilePicturesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on fieldname or route
    if (file.fieldname === 'selfie' || req.path.includes('attendance')) {
      cb(null, selfiesDir);
    } else if (file.fieldname === 'profilePicture' || req.path.includes('profile')) {
      cb(null, profilePicturesDir);
    } else {
      cb(null, documentsDir);
    }
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${req.user?.id || 'anonymous'}`;
    const ext = path.extname(file.originalname);
    
    // For profile pictures, use simpler naming
    if (file.fieldname === 'profilePicture') {
      cb(null, `profile-${uniqueSuffix}${ext}`);
    } else {
      const basename = path.basename(file.originalname, ext);
      cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
  },
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed'));
  }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and document files are allowed'));
  }
};

// Multer configurations
const uploadSelfie = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for selfies
  },
  fileFilter: imageFilter,
}).single('selfie');

const uploadDocument = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for documents
  },
  fileFilter: documentFilter,
}).single('document');

const uploadDocuments = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: documentFilter,
}).array('documents', 5); // Max 5 files

// General upload (single file)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFilter,
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum is 5 files.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  next();
};

module.exports = {
  uploadSelfie,
  uploadDocument,
  uploadDocuments,
  upload,
  handleUploadError,
};

