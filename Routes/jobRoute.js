const express = require('express');
const { createJob, updateJob, deleteJob, getAllJobs } = require('../Controllers/jobController');
const authenticateJWT = require('../Middleware/authenticateJWT'); // middleware to verify token
const onlyRecruiter = require('../Middleware/onlyRecruiter');

const router = express.Router();

// Public route
router.get('/jobs', getAllJobs);

// Recruiter-only routes
router.post('/jobs', authenticateJWT, onlyRecruiter, createJob);
router.put('/jobs/:id', authenticateJWT, onlyRecruiter, updateJob);
router.delete('/jobs/:id', authenticateJWT, onlyRecruiter, deleteJob);

module.exports = router;
