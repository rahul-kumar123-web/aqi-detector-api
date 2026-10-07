const chatbotRoutes = require("./routes/chatbotRoutes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const aqiRoutes = require("./routes/aqiRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AQI Detector API Running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/aqi", aqiRoutes);
app.use("/api/chatbot", chatbotRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorMiddleware);


module.exports = app;