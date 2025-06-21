const express = require("express");
const router = express.Router();


const { createApplication, getAllApplications, deleteApplication, getApplicationByApplicantId, getApplicationByCompanyId, getApplicationByJobId } = require("../Controllers/applicationController");
const authenticateUser = require("../Middleware/authenticateUser");

router.post("/", authenticateUser,createApplication);

router.get("/",getAllApplications ); 

router.delete("/:id", deleteApplication);
router.get("/get-applications-by-job/:id", getApplicationByApplicantId); 
router.get("/get-applications-by-company/:id", getApplicationByCompanyId); 
router.get("/get-application-by-jobid/:id", getApplicationByJobId); 

module.exports = router;
