const express = require("express");
const router = express.Router();

const pollutants = require("../controllers/pollutants");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(pollutants.index)
  .post(uploadFile.single("load-excel"), pollutants.loadExcelData);

module.exports = router;
