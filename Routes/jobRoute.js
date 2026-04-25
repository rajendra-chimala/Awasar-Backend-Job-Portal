const express = require('express');
const { createJob, updateJob, deleteJob, getAllJobs, searchJobs, getJobById, getSingleJobById } = require('../Controllers/jobController');
const authenticateJWT = require('../Middleware/authenticateJWT'); // middleware to verify token
const onlyRecruiter = require('../Middleware/onlyRecruiter');

const router = express.Router();

// Public routes
router.get('/get-job/:id', getSingleJobById);
router.get('/all-jobs', getAllJobs);

// Recruiter-only routes
router.post('/jobs', authenticateJWT, onlyRecruiter, createJob);
router.put('/jobs/:id', authenticateJWT, onlyRecruiter, updateJob);
router.delete('/:id', deleteJob);
router.get('/get-job-by-id/:id', getJobById);
router.get('/search', searchJobs);


module.exports = router;
