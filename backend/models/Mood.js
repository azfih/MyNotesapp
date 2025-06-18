const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: { 
    type: String, 
    required: true 
  },
  moodEmoji: { 
    type: String, 
    required: true 
  },
  moodColor: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


moodSchema.index({ user: 1, date: 1 }, { unique: true });

const Mood = mongoose.model("Mood", moodSchema);
module.exports = Mood;