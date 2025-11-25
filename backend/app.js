const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");

// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect DB
//connectDB();

// Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// Routes
//app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

module.exports = app;
