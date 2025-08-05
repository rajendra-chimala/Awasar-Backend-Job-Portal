const User = require("../DB/models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { name, email, phone, password, address, bio, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Adjusted file handling
    const profileUrl = req.files?.profile?.[0]?.filename
      ? `/uploads/profiles/${req.files.profile[0].filename}`
      : "";

    const cvUrl = req.files?.cvUrl?.[0]?.filename
      ? `/uploads/cv/${req.files.cvUrl[0].filename}`
      : "";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      profileUrl,
      address,
      cvUrl,
      bio,
      role,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    const id = user._id;
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Generate a token (optional, if you want to implement JWT or session-based auth)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Optionally, you can send the token in the response

    // Send response
    res.status(200).json({ message: "Login successful", token, id });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id; // from auth middleware
    const { name, email, phone, address, bio } = req.body;

    // ✅ Adjusted file handling
    const profileUrl = req.files?.profile?.[0]?.filename
      ? `/uploads/profiles/${req.files.profile[0].filename}`
      : undefined;

    const cvUrl = req.files?.cvUrl?.[0]?.filename
      ? `/uploads/cv/${req.files.cvUrl[0].filename}`
      : undefined;

    const updateData = {
      name,
      email,
      phone,
      address,
      bio,
      ...(profileUrl && { profileUrl }),
      ...(cvUrl && { cvUrl }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { userRegister, loginUser, getUserById, updateProfile };
