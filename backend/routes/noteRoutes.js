const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { 
  getNotesByCategory, 
  createNote, 
  getNoteById, 
  updateNote, 
  deleteNote 
} = require("../controllers/noteController");

// All routes require authentication
router.use(authMiddleware);

// GET /api/notes - Get notes by category (or all notes)
router.get("/", getNotesByCategory);

// POST /api/notes - Create new note
router.post("/", createNote);

// GET /api/notes/:id - Get single note
router.get("/:id", getNoteById);

// PUT /api/notes/:id - Update note
router.put("/:id", updateNote);

// DELETE /api/notes/:id - Delete note
router.delete("/:id", deleteNote);

module.exports = router;