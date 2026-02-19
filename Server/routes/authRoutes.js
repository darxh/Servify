const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");

const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  verifyEmail,
  googleLogin,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

router.get("/verify/:token", verifyEmail);
router.get("/me", protect, getMe);

router.put("/profile", protect, upload.single("profileImage"), updateUserProfile);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;