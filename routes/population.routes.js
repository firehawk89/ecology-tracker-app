const express = require("express");
const router = express.Router();

const populationController = require("../controllers/population.controller");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(populationController.index)
  .post(populationController.addNewPopulation);

router.route("/new").get(populationController.renderNewPopulationForm);

router
  .route("/load-excel")
  .post(uploadFile.single("load-excel"), populationController.loadFromExcel);

router
  .route("/:populationId")
  .put(populationController.updatePopulation)
  .delete(populationController.deletePopulation);

router
  .route("/:populationId/edit")
  .get(populationController.renderEditPopulationForm);

module.exports = router;
