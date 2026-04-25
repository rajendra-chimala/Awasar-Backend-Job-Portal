const express = require("express");
const router = express.Router();
const { adminRegister, loginAdmin } = require("../Controllers/adminController");

router.post(
  "/register",
  adminRegister
);
router.post("/login", loginAdmin);

module.exports = router;
