const Note = require("../models/Notes");

// Fetch notes by category
const getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const notes = await Note.find(category ? { category } : {}); // Fetch all if no category
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { getNotesByCategory };
