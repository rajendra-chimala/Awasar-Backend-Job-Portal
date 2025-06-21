const Application = require('../DB/models/application');
const User = require('../DB/models/userModel');
const Job = require('../DB/models/jobModel');

const createApplication = async (req, res) => {
  try {
    const applicantId = req.user; // from auth middleware
   
    const { jobId } = req.body;

    // Validate Job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applicant = await Application.findOne({applicantId});
    console.log(applicant);
    if (applicant) {
      return res.status(404).json({ message: 'Already Applied !' });
    }
    // Get recruiterId from job
    const recruiterId = job.companyId;

    // Get applicant CV
    const user = await User.findById(applicantId);
    if (!user || !user.cvUrl) {
      return res.status(400).json({ message: 'CV not found in applicant profile' });
    }

    // Optional: Prevent duplicate application
    const existing = await Application.findOne({ jobId, applicantId });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = new Application({
      jobId,
      recruiterId,
      applicantId,
      cvUrl: user.cvUrl
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully', application });

  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title')
      .populate('applicantId', 'name email')
      .populate('recruiterId', 'companyName');

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await Application.findByIdAndDelete(id);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getApplicationByApplicantId = async (req, res) => {
  try {
    const applicantId = req.params.id; 
    const applications = await Application.find({ applicantId })
      .populate('jobId', 'title')
      .populate('recruiterId', 'companyName');
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications by applicant ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getApplicationByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.id; 
    const applications = await Application.find({ recruiterId: companyId })
      
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications by company ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getApplicationByJobId = async (req, res) => {
  try {
    const jobId = req.params.id; 
    const applications = await Application.find({ jobId })
      .populate('applicantId', 'name email')
      .populate('recruiterId', 'companyName');
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications by job ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createApplication,
  getAllApplications,
  deleteApplication,
  getApplicationByApplicantId,
  getApplicationByCompanyId,
  getApplicationByJobId
};
