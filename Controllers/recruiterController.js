const Company = require('../DB/models/recruiterModel'); // adjust path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Recruiter
const registerRecruiter = async (req, res) => {
  try {
    const {
      companyName,
      address,
      noOfEmployee,
      bio,
      websiteURL,
      email,
      password,
    } = req.body;

    const existingRecruiter = await Company.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({ message: 'Recruiter already exists' });
    }

    const profileUrl = req.file ? `/uploads/profiles/${req.file.filename}` : '';

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRecruiter = new Company({
      companyName,
      address,
      noOfEmployee,
      bio,
      websiteURL,
      email,
      password: hashedPassword,
      profileUrl,
      role: 'recruiter',
    });

    await newRecruiter.save();
    res.status(201).json({ message: 'Recruiter registered successfully', recruiter: newRecruiter });

  } catch (error) {
    console.error('Error registering recruiter:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Recruiter
const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const recruiter = await Company.findOne( {email} );
    const id = recruiter._id;
    console.log(recruiter);
    if (!recruiter) {
      return res.status(400).json({ message: 'Invalid email or password bnbn' });
    }

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({ message: 'Login successful', token,id });
  } catch (error) {
    console.error('Error logging in recruiter:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecruiterById = async (req,res)=>{

  try {
    const recruiterId = req.params.id;
    console.log(req.params.id)
    const recruiter = await Company.findById(recruiterId).select('-password');
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    console.log(recruiter);
    res.status(200).json(recruiter);

}
  catch (error) {
    console.error('Error fetching recruiter:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  registerRecruiter,
  loginRecruiter,
  getRecruiterById
};
