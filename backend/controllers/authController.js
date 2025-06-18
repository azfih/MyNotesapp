const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Username already taken"
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Server error during registration" 
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error during login" 
    });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ 
      message: "Server error fetching user data" 
    });
  }
};

// Logout User (client-side mainly, but can blacklist tokens if needed)
const logoutUser = (req, res) => {
  // In a stateless JWT setup, logout is mainly handled client-side
  // by removing the token. You can implement token blacklisting here if needed.
  res.status(200).json({ 
    message: "Logged out successfully" 
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
};
