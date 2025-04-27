const express = require("express");
const router = express.Router();
const { getNotesByCategory } = require("../controllers/noteController");

router.get("/notes", getNotesByCategory);

module.exports = router;
