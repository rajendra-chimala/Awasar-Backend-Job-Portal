const jwt = require('jsonwebtoken');
const User = require('../DB/models/userModel');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiter = await User.findById(decoded.id);
    if (!recruiter) return res.status(401).json({ message: 'Invalid token' });

    // console.log("RID : "+recruiter._id)
    req.user = recruiter._id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }
};

module.exports = authenticateUser;
