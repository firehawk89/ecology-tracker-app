const express = require("express");
const router = express.Router();

const objectController = require("../controllers/objects.controller");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(objectController.index)
  .post(objectController.addNewObject);

router.route("/new").get(objectController.renderNewObjectForm);

router
  .route("/load-excel")
  .post(uploadFile.single("load-excel"), objectController.loadFromExcel);

router
  .route("/:objectId")
  .put(objectController.updateObject)
  .delete(objectController.deleteObject);

router.route("/:objectId/edit").get(objectController.renderEditObjectForm);

module.exports = router;
