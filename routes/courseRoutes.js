const express = require("express");
const { createCourse, getAllCourse, getCourseById } = require("../controllers/courseController");
const upload = require("../middleware/multerUpload.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();


router.post("/create", auth, createCourse);
router.get("/getall", getAllCourse);
router.get("/get/:id", auth, getCourseById);

module.exports = router;