const express = require("express");
const router = express.Router();
const upload = require("../Middleware/uploadProfileImage"); // adjust path if using combined upload
const { registerRecruiter, loginRecruiter } = require("../Controllers/recruiterController");

// Register recruiter (with profile image upload)
router.post("/register", upload.single("profile"), registerRecruiter);

// Login recruiter
router.post("/login", loginRecruiter);

module.exports = router;
