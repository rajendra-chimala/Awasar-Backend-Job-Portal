const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profileUrl: { type: String },
  address: { type: String },
  cvUrl: { type: String },
  bio: { type: String },
  role: { type: String, enum: ['recruiter', 'user'], default: 'user' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userModel);
