const User = require('../models/userModel');
const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

exports.viewEnrollment = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'enrolledCourses',
            populate: {
                path: 'course',
                select: 'Course'
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        return res.status(200).json({ success: true, enrollments: user.enrolledCourses })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.enrollInCourse = async (req, res) => {
    const { courseId } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const isUserEnrolled = course.enrolledUsers.some(
            (enrollment) => enrollment.user.toString() === req.user.id
        );

        if (isUserEnrolled) {
            return res.status(200).json({
                success: true,
                message: "User is already enrolled in this course.",
            });
        }

        course.enrolledUsers.push({
            user: req.user.id,
            enrollStatus: "Enrolled",
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: "Enrollment successful",
            course
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProgress = async (req, res) => {
    const { enrollmentId, progress } = req.body;

    try {
        const enrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            { progress },
            { new: true }
        );

        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

        res.status(200).json({ success: true, message: "Progress updated", enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            "enrolledUsers.user": req.user.id
        }).populate("enrolledUsers.user", "userName email");
        res.status(200).json({
            success: true,
            enrolledCourses: courses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};