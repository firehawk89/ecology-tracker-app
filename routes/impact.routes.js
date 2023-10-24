const express = require("express");
const router = express.Router();

const impactControllers = require("../controllers/impact.controller.js");

router
  .route("/")
  .get(impactControllers.index)
  .post(impactControllers.calculateImpact);

module.exports = router;
