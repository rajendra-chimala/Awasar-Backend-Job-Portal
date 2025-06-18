// middleware/onlyRecruiter.js
const onlyRecruiter = (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    next();
  } else {
    return res.status(403).json({ message: 'Only recruiters are allowed to perform this action' });
  }
};

module.exports = onlyRecruiter;
 