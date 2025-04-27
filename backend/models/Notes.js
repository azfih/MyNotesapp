const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  mood: String, // Emoji mood
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
