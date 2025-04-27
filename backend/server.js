const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const moodRoutes = require("./routes/moodRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", noteRoutes);
app.use("/api/moods", moodRoutes);
mongoose
  .connect("mongodb://localhost:27017/mynotes", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
