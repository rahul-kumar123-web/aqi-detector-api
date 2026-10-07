
const express = require("express");

const {
  getAllAQI,
  getCityAQI,
  getCityHistory,
  addAQI,
  deleteAQI,
  getLiveCityAQI,
  getIndiaAQI,
} = require("../controllers/aqiController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// GET ALL AQI
// ========================================

router.get("/", getAllAQI);


// ========================================
// INDIA AQI MAP
// IMPORTANT: /india must come BEFORE /:city
// ========================================

router.get("/india", getIndiaAQI);


// ========================================
// LIVE CITY AQI
// ========================================

router.get("/:city/live", getLiveCityAQI);


// ========================================
// CITY HISTORY
// ========================================

router.get("/:city/history", getCityHistory);


// ========================================
// SINGLE CITY AQI
// ========================================

router.get("/:city", getCityAQI);


// ========================================
// ADMIN - ADD AQI
// ========================================

router.post(
  "/",
  protect,
  adminOnly,
  addAQI
);


// ========================================
// ADMIN - DELETE AQI
// ========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteAQI
);


module.exports = router;

