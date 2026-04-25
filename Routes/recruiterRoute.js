const express = require("express");
const router = express.Router();
const upload = require("../Middleware/uploadProfileImage"); // adjust path if using combined upload
const { registerRecruiter, loginRecruiter, getRecruiterById, getAllRecruiters, deleteRecruiter } = require("../Controllers/recruiterController");

// Register recruiter (with profile image upload)
router.post("/register", upload.single("profile"), registerRecruiter);

// Login recruiter
router.post("/login", loginRecruiter);
router.get("/company/profile/:id",getRecruiterById)
router.get("/recruiters",getAllRecruiters)
router.delete("/:id",deleteRecruiter)

module.exports = router;
