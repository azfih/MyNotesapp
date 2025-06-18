const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number")
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

// Routes
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
