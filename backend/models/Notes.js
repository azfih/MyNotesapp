const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ["Daily Task Tracker", "Mood Tracker", "Health Tracker", "Notes"],
    default: "Notes"
  },
  emoji: {
    type: String,
    default: "📝"
  },
  backgroundColor: {
    type: String,
    default: "#ffffff"
  },
  textColor: {
    type: String,
    default: "#000000"
  },
  stickers: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
noteSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
