const mongoose = require("mongoose");

const aqiSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },

    aqi: {
      type: Number,
      required: true,
    },

    pm25: {
      type: Number,
      default: 0,
    },

    pm10: {
      type: Number,
      default: 0,
    },

    no2: {
      type: Number,
      default: 0,
    },

    so2: {
      type: Number,
      default: 0,
    },

    co: {
      type: Number,
      default: 0,
    },

    o3: {
      type: Number,
      default: 0,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AQI", aqiSchema);