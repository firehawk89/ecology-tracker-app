const express = require("express");
const router = express.Router();

const pollutionControllers = require("../controllers/pollutions");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(pollutionControllers.index)
  .post(pollutionControllers.addNewPollution);

router.route("/new").get(pollutionControllers.renderNewPollutionForm);

router
  .route("/load-excel")
  .post(uploadFile.single("load-excel"), pollutionControllers.loadFromExcel);

router
  .route("/:pollutionId")
  .put(pollutionControllers.updatePollution)
  .delete(pollutionControllers.deletePollution);

router
  .route("/:pollutionId/edit")
  .get(pollutionControllers.renderEditPollutionForm);

module.exports = router;
