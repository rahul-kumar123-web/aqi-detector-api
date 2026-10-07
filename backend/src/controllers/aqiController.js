const AQI = require("../models/AQI");

const {
  getAQIFromAPI,
  getIndiaAQI: getIndiaAQIFromAPI,
  getHistoricalAQI,
} = require("../services/aqiApiService");

// ========================================
// Get all AQI records from MongoDB
// ========================================

const getAllAQI = async (req, res, next) => {
  try {
    const records = await AQI.find()
      .sort({ recordedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get latest AQI of a city from MongoDB
// ========================================

const getCityAQI = async (req, res, next) => {
  try {
    const city = req.params.city;

    const record = await AQI.findOne({
      city: {
        $regex: `^${city}$`,
        $options: "i",
      },
    }).sort({ recordedAt: -1 });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "AQI data not found for this city",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Historical Air Quality Analysis
// Open-Meteo
// ========================================

const getCityHistory = async (req, res, next) => {
  try {
    const city = req.params.city;

    // Default = 7 days
    const days = req.query.days || 7;

    const data = await getHistoricalAQI(city, days);

    res.json({
      success: true,
      source: "Open-Meteo",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get LIVE AQI of a city
// Open-Meteo
// ========================================

const getLiveCityAQI = async (req, res, next) => {
  try {
    const city = req.params.city;

    const data = await getAQIFromAPI(city);

    res.json({
      success: true,
      source: "Open-Meteo",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get INDIA AQI
// Used by India Air Quality Map
// ========================================

const getIndiaAQI = async (req, res, next) => {
  try {
    const data = await getIndiaAQIFromAPI();

    res.json({
      success: true,
      source: "Open-Meteo",
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Add AQI
// Admin only
// ========================================

const addAQI = async (req, res, next) => {
  try {
    const {
      city,
      aqi,
      pm25,
      pm10,
      no2,
      so2,
      co,
      o3,
    } = req.body;

    if (!city || aqi === undefined) {
      return res.status(400).json({
        success: false,
        message: "City and AQI are required",
      });
    }

    const record = await AQI.create({
      city,
      aqi,
      pm25,
      pm10,
      no2,
      so2,
      co,
      o3,
    });

    res.status(201).json({
      success: true,
      message: "AQI record added",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Delete AQI
// Admin only
// ========================================

const deleteAQI = async (req, res, next) => {
  try {
    const record = await AQI.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "AQI record not found",
      });
    }

    res.json({
      success: true,
      message: "AQI record deleted",
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  getAllAQI,
  getCityAQI,
  getCityHistory,
  getLiveCityAQI,
  getIndiaAQI,
  addAQI,
  deleteAQI,
};