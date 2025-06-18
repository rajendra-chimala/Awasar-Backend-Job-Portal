const express = require('express');
const router = express.Router();
const {
  createApplication,
  getAllApplications,
  deleteApplication
} = require('../Controllers/applicationController');

const authMiddleware = require('../Middleware/authMiddleware');
const uploadCV = require('../Middleware/uploadCV'); 


router.post('/', authMiddleware, createApplication);


router.get('/', authMiddleware, getAllApplications);


router.delete('/:id', authMiddleware, deleteApplication);

module.exports = router;
