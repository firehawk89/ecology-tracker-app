const express = require("express");
const router = express.Router();

const pollutantController = require("../controllers/pollutants.controller");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(pollutantController.index)
  .post(pollutantController.addNewPollutant);

router.route("/new").get(pollutantController.renderNewPollutantForm);

router
  .route("/load-excel")
  .post(uploadFile.single("load-excel"), pollutantController.loadFromExcel);

router
  .route("/:pollutantId")
  .put(pollutantController.updatePollutant)
  .delete(pollutantController.deletePollutant);

router
  .route("/:pollutantId/edit")
  .get(pollutantController.renderEditPollutantForm);

module.exports = router;
