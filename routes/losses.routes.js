const express = require("express");
const router = express.Router();

const lossesController = require("../controllers/losses.controller.js");

router
  .route("/")
  .get(lossesController.index)
  .post(lossesController.calculateLosses);

module.exports = router;
