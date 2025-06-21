const Job = require('../DB/models/jobModel');
const Company = require('../DB/models/recruiterModel'); 

// Create Job
const createJob = async (req, res) => {
  try {
    const { jobTitle, description, location, salary,contact,type,requirement,responsibility,deadline,tags  } = req.body;
    const companyId = req.user._id;
    const company = await Company.findById(companyId);
    const companyProfile = company.profileUrl ;

    const job = new Job({ jobTitle, description, location, salary,type, companyId,contact,companyProfile,requirement,responsibility,deadline,tags  });
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


const searchJobs = async (req, res) => {
  const { query } = req.query;

  try {
    const jobs = await Job.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
 
  try {
const jobs = await Job.find({ companyId: req.params.id })

    if (!jobs) return res.status(404).json({ message: 'Job not found' });

    res.json(jobs);
  } catch (err) {
    console.error('Fetch Job by ID Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { createJob, searchJobs, updateJob, deleteJob, getAllJobs,getJobById };
