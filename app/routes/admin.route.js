const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const adminAuth = require("../middlewares/adminAuth");

router.post("/admin/signup", adminController.signUP);
router.post("/admin/login", adminController.signIn);
router.post("/admin/refresh", adminController.refresh);    
router.post("/admin/signout", adminAuth, adminController.signout);

module.exports = router;
