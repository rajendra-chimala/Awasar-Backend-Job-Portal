const Job = require('../DB/models/jobModel');

// Create Job
const createJob = async (req, res) => {
  try {
    const { jobTitle, description, location, salary,contact,type } = req.body;
    const companyId = req.user._id;

    const job = new Job({ jobTitle, description, location, salary,type, companyId,contact });
    await job.save();

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (err) {
    console.error('Create Job Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOneAndUpdate({ _id: id, companyId: req.user._id }, req.body, { new: true });

    if (!job) return res.status(404).json({ message: 'Job not found or not authorized' });

    res.json({ message: 'Job updated', job });
  } catch (err) {
    console.error('Update Job Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOneAndDelete({ _id: id, companyId: req.user._id });

    if (!job) return res.status(404).json({ message: 'Job not found or not authorized' });

    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Delete Job Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('companyId', 'companyName');
    res.json(jobs);
  } catch (err) {
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createJob, updateJob, deleteJob, getAllJobs };
