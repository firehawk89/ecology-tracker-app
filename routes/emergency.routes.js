const express = require("express");
const router = express.Router();

const emergencyController = require("../controllers/emergency.controller.js");

router
  .route("/")
  .get(emergencyController.index)
  .post(emergencyController.calculateEmergency);

module.exports = router;
