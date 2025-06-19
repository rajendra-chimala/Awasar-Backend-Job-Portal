const express = require("express");
const router = express.Router();


const { createApplication, getAllApplications, deleteApplication } = require("../Controllers/applicationController");
const authenticateUser = require("../Middleware/authenticateUser");

router.post("/", authenticateUser,createApplication);

router.get("/",getAllApplications ); 

router.delete("/:id", deleteApplication);

module.exports = router;
