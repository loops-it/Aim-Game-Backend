const express = require("express");
const authController = require("../controllers/AuthController");
const { createToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/login").post(createToken);
router.route("/select-workspace").post(authController.selectWorkspace);
router.route("/forget-password").post(authController.forgetPassword);
router.route("/reset-password").post(authController.resetPassword);
router.route("/verify").post(authController.verifyUser); 
module.exports = router;
