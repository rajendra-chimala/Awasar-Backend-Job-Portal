const express = require("express");
const router = express.Router();
const { userRegister, loginUser, getUserById, updateProfile } = require("../Controllers/userController");
const upload = require("../Middleware/uploadCombines");
const authenticateUser = require("../Middleware/authenticateUser");

router.post(
  "/register",
  upload.fields([
    { name: "cvUrl", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),
  userRegister
);
router.post("/login", loginUser);
router.get("/profile/:id",getUserById);
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
});
router.put('/update-profile/:id', upload.fields([
    { name: "cvUrl", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),updateProfile);







module.exports = router;
