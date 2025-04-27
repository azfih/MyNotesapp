const express = require("express");
const Mood = require("../models/Mood");
const router = express.Router();

// Add or update a mood
router.post("/", async (req, res) => {
  const { date, moodEmoji, moodColor } = req.body;
  try {
    const mood = await Mood.findOneAndUpdate(
      { date },
      { moodEmoji, moodColor },
      { new: true, upsert: true }
    );
    res.json(mood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all moods
router.get("/", async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
