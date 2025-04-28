const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const noteRoutes = require("./routes/noteRoutes");
const moodRoutes = require("./routes/moodRoutes.js");

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", noteRoutes);
app.use("/api/moods", moodRoutes);

// Connect to MongoDB using the URI from .env file
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));