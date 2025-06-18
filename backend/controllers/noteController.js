const Note = require("../models/Notes");

// Get notes by category for authenticated user
const getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const userId = req.user._id; // Get from auth middleware
    
    const query = { user: userId };
    if (category && category !== 'undefined') {
      query.category = category;
    }
    
    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Notes fetch error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, category, emoji, backgroundColor, textColor, stickers } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    
    const note = new Note({
      user: req.user._id,
      title: title.trim(),
      content: content.trim(),
      category: category || "Notes",
      emoji: emoji || "📝",
      backgroundColor: backgroundColor || "#ffffff",
      textColor: textColor || "#000000",
      stickers: stickers || []
    });
    
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Note creation error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get single note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.json(note);
  } catch (error) {
    console.error("Note fetch error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { title, content, category, emoji, backgroundColor, textColor, stickers } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: title?.trim(),
        content: content?.trim(),
        category,
        emoji,
        backgroundColor,
        textColor,
        stickers,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.json(note);
  } catch (error) {
    console.error("Note update error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Note deletion error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { 
  getNotesByCategory, 
  createNote, 
  getNoteById, 
  updateNote, 
  deleteNote 
};