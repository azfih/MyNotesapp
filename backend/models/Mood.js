const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  moodEmoji: { type: String, required: true },
  moodColor: { type: String, required: true },
});

const Mood = mongoose.model("Mood", moodSchema);

module.exports = Mood;
