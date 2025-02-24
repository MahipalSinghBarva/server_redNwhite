const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    assignments: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            dueDate: { type: Date },
            assignmentUrl: { type: String },
        },
    ],
    video: [
        {
            title: { type: String, required: true },
            content: { type: String },
            videoUrl: { type: String, required: true },
        },
    ],
    enrolledUsers: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            enrollStatus: {
                type: String,
                enum: ["Enrolled", "Completed", "Dropped"],
                default: "Enrolled"
            },
            enrolledAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);