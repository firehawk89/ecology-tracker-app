const express = require("express");
const router = express.Router();

const impactController = require("../controllers/impact.controller.js");

router
  .route("/")
  .get(impactController.index)
  .post(impactController.calculateImpact);

module.exports = router;
