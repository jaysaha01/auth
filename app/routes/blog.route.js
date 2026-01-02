const express = require('express')
const blogController = require("../controllers/blog.controller")
const router = express.Router()
const adminAuth = require("../middlewares/adminAuth");
const roleCheck = require("../middlewares/authorize");


router.get("/profile",adminAuth,roleCheck("admin"), adminAuth,blogController.viewhome)

module.exports = router