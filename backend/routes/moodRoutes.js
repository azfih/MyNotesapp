const express = require("express");
const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Add or update a mood (PROTECTED)
router.post("/", authMiddleware, async (req, res) => {
  const { date, moodEmoji, moodColor } = req.body;
  
  try {
    const mood = await Mood.findOneAndUpdate(
      { user: req.user._id, date },
      { moodEmoji, moodColor },
      { new: true, upsert: true }
    );
    res.json(mood);
  } catch (err) {
    console.error("Mood save error:", err);
    res.status(500).json({ error: "Failed to save mood" });
  }
});

// Get all moods for current user (PROTECTED)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error("Mood fetch error:", err);
    res.status(500).json({ error: "Failed to fetch moods" });
  }
});

// Get mood for specific date (PROTECTED)
router.get("/:date", authMiddleware, async (req, res) => {
  try {
    const mood = await Mood.findOne({ 
      user: req.user._id, 
      date: req.params.date 
    });
    
    if (!mood) {
      return res.status(404).json({ message: "No mood found for this date" });
    }
    
    res.json(mood);
  } catch (err) {
    console.error("Mood fetch error:", err);
    res.status(500).json({ error: "Failed to fetch mood" });
  }
});

// Delete mood for specific date (PROTECTED)
router.delete("/:date", authMiddleware, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ 
      user: req.user._id, 
      date: req.params.date 
    });
    
    if (!mood) {
      return res.status(404).json({ message: "No mood found for this date" });
    }
    
    res.json({ message: "Mood deleted successfully" });
  } catch (err) {
    console.error("Mood delete error:", err);
    res.status(500).json({ error: "Failed to delete mood" });
  }
});

module.exports = router;
