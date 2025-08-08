const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller");

router.get("/login",controller.login);

router.post("/login",controller.loginPost);

router.get("/logout",controller.logout);

// Forgot password routes
router.get("/forgot-password", controller.forgotPassword);
router.post("/forgot-password", controller.forgotPasswordPost);
router.get("/otp-password", controller.otpPassword);
router.post("/otp-password", controller.otpPasswordPost);
router.get("/reset-password", controller.resetPassword);
router.post("/reset-password", controller.resetPasswordPost);

module.exports = router;