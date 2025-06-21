const mongoose = require("mongoose");

const jobModel = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  description: { type: String, required: true },
  contact:{type: String, required: true},
  salary: { type: String },
  location: { type: String },
  type: {
    type: String,
    enum: ["full-time", "part-time", "remote", "contract", "internship"],
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  companyProfile:{
    type:String,
    required:true
  },
  requirement: [{ type: String }],
  responsibility: [{ type: String }],
  postedAt: { type: Date, default: Date.now },
  deadline: { type: Date },
  tags: [{ type: String }],
});

module.exports = mongoose.model("Job", jobModel);
