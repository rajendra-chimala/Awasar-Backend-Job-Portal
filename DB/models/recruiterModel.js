const mongoose = require('mongoose');

const recuiterModel = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  noOfEmployee: { type: Number },
  bio: { type: String },
  websiteURL: { type: String },
  profileUrl: { type: String },
  role: { type: String, enum: ['recruiter', 'user'], default: 'recruiter' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', recuiterModel);
