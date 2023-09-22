const express = require("express");
const router = express.Router();

const pollutantControllers = require("../controllers/pollutants");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(pollutantControllers.index)
  .post(uploadFile.single("load-excel"), pollutantControllers.loadExcelData);

router.route("/:pollutantId").delete(pollutantControllers.deletePollutant);

module.exports = router;
