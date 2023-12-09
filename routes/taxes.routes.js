const express = require("express");
const router = express.Router();

const taxesController = require("../controllers/taxes.controller.js");

router
  .route("/")
  .get(taxesController.index)
  .post(taxesController.calculateTaxes);

module.exports = router;
