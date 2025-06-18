const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import routes
const noteRoutes = require("./routes/noteRoutes");
const moodRoutes = require("./routes/moodRoutes");
const authRoutes = require("./routes/authRoutes"); // NEW

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // NEW - Auth routes
app.use("/api/notes", noteRoutes);
app.use("/api/moods", moodRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString() 
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));