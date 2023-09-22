const express = require("express");
const router = express.Router();

const objectControllers = require("../controllers/objects");
const uploadFile = require("../config/multer");

router
  .route("/")
  .get(objectControllers.index)
  .post(uploadFile.single("load-excel"), objectControllers.loadExcelData);

router.route("/:objectId").delete(objectControllers.deleteObject);

module.exports = router;
