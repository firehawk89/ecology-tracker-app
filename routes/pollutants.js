const express = require("express");
const router = express.Router();

const pollutantControllers = require("../controllers/pollutants");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(pollutantControllers.index)
  .post(pollutantControllers.addNewPollutant);

router.route("/new").get(pollutantControllers.renderNewPollutantForm);

router
  .route("/load-excel")
  .post(uploadFile.single("load-excel"), pollutantControllers.loadFromExcel);

router.route("/:pollutantId").delete(pollutantControllers.deletePollutant);

module.exports = router;
