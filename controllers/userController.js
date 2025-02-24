const User = require("../models/userModel.js")
const sendToken = require('../utils/jwt.js');

exports.register = async (req, res) => {
    const { userName, email, password, confirmPassword } = req.body;
    if (!userName || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    try {
        
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Username or email already exists." });
        }

        const user = await User.create({ userName, email, password });
        const token = user.getJWTToken();
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: { id: user._id, userName: user.userName, email: user.email },
            token,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message,
        });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("All fields are required.")
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json("User is found, please register first")
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(400).json("Incorrect password")
        }
        sendToken(user, 200, res, "Login Successful");
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};


exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
};

exports.profileUpdate = async (req, res) => {
    try {
        const { userName, email } = req.body;
        if (!userName && !email) {
            return res.status(400).json({ success: false, message: "At least one field is required." });
        }

        const user = await User.findByIdAndUpdate(req.user.id, { userName, email }, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(404).json({ success: false, message: "Failed to update profile", error: error })
    }
}


exports.logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        return res.status(200).json({
            success: true,
            message: "Logout successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging out",
            error: error.message,
        });
    }
};