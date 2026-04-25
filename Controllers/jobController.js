const Job = require('../DB/models/jobModel');
const Company = require('../DB/models/recruiterModel');

// ================= CREATE JOB =================
const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      description,
      location,
      salary,
      contact,
      type,
      requirement,
      responsibility,
      deadline,
      tags
    } = req.body;

    const companyId = req.user._id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const job = new Job({
      jobTitle,
      description,
      location,
      salary,
      type,
      contact,
      requirement,
      responsibility,
      deadline,
      tags,
      companyId,
      companyProfile: company.profileUrl
    });

    await job.save();

    res.status(201).json({ message: "Job created successfully", job });

  } catch (err) {
    console.error("Create Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE JOB =================
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOneAndUpdate(
      { _id: id, companyId: req.user._id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    res.json({ message: "Job updated", job });

  } catch (err) {
    console.error("Update Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE JOB =================
const deleteJob = async (req, res) => {
  try {
    console.log("Delete request for job ID:", req.params.id);
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    res.json({ message: "Job deleted successfully" });

  } catch (err) {
    console.error("Delete Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL JOBS =================
const getAllJobs = async (req, res) => {
  try {
    const currentDate = new Date();

    const jobs = await Job.find({
      deadline: { $gte: currentDate } // ✅ only active jobs
    })
      .populate("companyId", "companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });

  } catch (err) {
    console.error("Fetch Jobs Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= SEARCH JOBS =================
const searchJobs = async (req, res) => {
  try {
    let { keyword } = req.query;

    const currentDate = new Date();
    // If no keyword → return all jobs
    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      const jobs = await Job.find({
        deadline: { $gte: currentDate } 
      })
        .populate("companyId", "companyName")
        .sort({ createdAt: -1 });

      return res.status(200).json({ jobs });
    }

    keyword = keyword.trim().toLowerCase();

    // Fetch all jobs to apply N-Gram rating in-memory
    const allJobs = await Job.find().populate("companyId", "companyName");

    // N-Gram tokenization algorithm
    const generateNGrams = (text, n) => {
      const nGrams = new Set();
      if (!text) return nGrams;

      const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalizedText.length < n) {
        if (normalizedText.length > 0) nGrams.add(normalizedText);
        return nGrams;
      }

      for (let i = 0; i <= normalizedText.length - n; i++) {
        nGrams.add(normalizedText.substring(i, i + n));
      }
      return nGrams;
    };

    const N = 2; // Bigrams
    const keywordGrams = generateNGrams(keyword, N);

    // if (keywordGrams.size === 0) {
    //   return res.status(200).json({ jobs: allJobs });
    // }

    // Similarity checking with threshold
    const threshold = 0.05; // Base required minimum similarity
    const matchResults = allJobs.map(job => {
      // Compose searchable dictionary of string parameters
      const fieldsToSearch = `${job.jobTitle || ''} ${job.description || ''} ${job.location || ''} ${job.tags ? job.tags.join(' ') : ''}`;

      const targetGrams = generateNGrams(fieldsToSearch, N);

      let intersectionCount = 0;
      keywordGrams.forEach(gram => {
        if (targetGrams.has(gram)) {
          intersectionCount++;
        }
      });

      // Calculate Dice's coefficient for similarity
      let score = 0;
      if (keywordGrams.size + targetGrams.size > 0) {
        score = (2.0 * intersectionCount) / (keywordGrams.size + targetGrams.size);
      }

      // Bonus: If there's an exact string match inside, boost score heavily
      if (fieldsToSearch.toLowerCase().includes(keyword)) {
        score += 1.0;
      }

      return { job, score };
    });

    const filteredAndSorted = matchResults
      .filter(item => item.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .map(item => item.job);

    res.status(200).json({ jobs: filteredAndSorted });

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET JOBS BY COMPANY =================
const getJobById = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.params.id })
      .populate("companyId", "companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });

  } catch (err) {
    console.error("Fetch Job by Company ID Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SINGLE JOB =================
const getSingleJobById = async (req, res) => {
  try {
    console.log("Fetching job with ID:", req.params.id);
    const job = await Job.findById(req.params.id);
    console.log("Fetched Job:", job);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);

  } catch (err) {
    console.error("Fetch Single Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  searchJobs,
  getJobById,
  getSingleJobById
};