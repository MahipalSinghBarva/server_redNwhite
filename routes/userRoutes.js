const express = require('express');

const { register, login, logout, getProfile, profileUpdate } = require("../controllers/userController.js");
const { auth } = require('../middleware/auth.js');

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", auth, logout)
router.get("/me", auth, getProfile)
router.put("/update", auth, profileUpdate)

module.exports = router;