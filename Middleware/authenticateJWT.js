const jwt = require('jsonwebtoken');
const Company = require('../DB/models/recruiterModel');

const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiter = await Company.findById(decoded.id);
    if (!recruiter) return res.status(401).json({ message: 'Invalid token' });

    req.user = recruiter;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }
};

module.exports = authenticateJWT;
