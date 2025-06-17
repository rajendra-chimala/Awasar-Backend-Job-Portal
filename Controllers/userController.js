const User = require('../DB/models/userModel');


const userRegister = async (req, res) => {
    try {
        const { name, email, phone, password, profileUrl, address, cvUrl, bio, role } = req.body;
    
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
        }
    
        // Create new user
        const newUser = new User({
        name,
        email,
        phone,
        password,
        profileUrl,
        address,
        cvUrl,
        bio,
        role,
        
        });
    
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}