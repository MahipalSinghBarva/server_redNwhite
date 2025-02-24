const Course = require("../models/courseModel.js");

exports.createCourse = async (req, res) => {
    const { name, description, author, banner, video, assignments } = req.body

    if (!name || !author || !description || !banner || !video || !assignments) {
        return res.status(400).json({
            success: false,
            message: "Name, author, and description are required."
        });
    }

    try {
        const course = await Course.create({ name, description, author, banner, video, assignments })
        return res.status(200).json({
            success: true,
            message: "Course created successfully.",
            data: course
        })
    } catch (error) {
        console.error("Course creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course. Please try again later.",
            error: error.message,
        });
    }
}

exports.getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find()
        return res.status(200).json({
            success: true,
            message: "All courses retrieved successfully.",
            data: courses
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Failed to retrieve courses."
        })
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(404).json({ message: "Course not found" });
        return res.status(200).json({ success: true, data: course })
    } catch (error) {
        return res.status(404).json({ success: false, message: "Error while finding Course" })
    }
}