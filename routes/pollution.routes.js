const express = require("express");
const router = express.Router();

const pollutionController = require("../controllers/pollution.controller");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(pollutionController.index)
  .post(pollutionController.addNewPollution);

router.route("/new").get(pollutionController.renderNewPollutionForm);

router
  .route("/load-excel")
  .post(uploadFile.single("load-excel"), pollutionController.loadFromExcel);

router
  .route("/:pollutionId")
  .put(pollutionController.updatePollution)
  .delete(pollutionController.deletePollution);

router
  .route("/:pollutionId/edit")
  .get(pollutionController.renderEditPollutionForm);

module.exports = router;
