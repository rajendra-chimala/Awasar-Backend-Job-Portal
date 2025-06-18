const multer = require('multer');
const path = require('path');

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cv'); // Folder for CVs (make sure it exists)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

// File filter - allow only PDF and Word docs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext || mime) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, .docx files are allowed!'), false);
  }
};

// Multer instance
const uploadCV = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 5MB max
});

module.exports = uploadCV;
