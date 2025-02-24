const express = require('express');

const { getEnrolledCourses, enrollInCourse, updateProgress } = require('../controllers/enrollmentController.js')
const { auth } = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, getEnrolledCourses);
router.post('/enroll', auth, enrollInCourse);
router.put('/progress', auth, updateProgress);

module.exports = router;