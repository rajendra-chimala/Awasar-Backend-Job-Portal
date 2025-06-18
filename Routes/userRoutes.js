const express = require("express");
const router = express.Router();
const { userRegister, loginUser } = require("../Controllers/userController");
const upload = require("../Middleware/uploadCombines");

router.post(
  "/register",
  upload.fields([
    { name: "cvUrl", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),
  userRegister
);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
});

module.exports = router;
