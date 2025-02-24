const User = require("../models/userModel.js");
const dotenv = require('dotenv');

dotenv.config();

const sendToken = (user, statusCode, res) => {
    try {
        const token = user.getJWTToken();

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token generation failed",
            });
        }

        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        };

        return res
            .status(statusCode)
            .cookie("token", token, options)
            .json({
                success: true,
                message: "Token sent successfully",
                token,
                user: {
                    id: user._id,
                    userName: user.userName,
                    email: user.email,
                },
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error generating token: ${error.message}`,
        });
    }
};

module.exports = sendToken;
