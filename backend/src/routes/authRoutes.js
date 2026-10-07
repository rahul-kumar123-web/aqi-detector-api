const express = require("express");

const {
  register,
  login,
  resetAdminPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Temporary development route
router.get("/reset-admin-password", resetAdminPassword);

module.exports = router;