const express = require("express");
const router = express.Router();

const objects = require("../controllers/objects");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(objects.index)
  .post(uploadFile.single("load-excel"), objects.loadExcelData);

module.exports = router;
