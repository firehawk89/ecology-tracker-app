const express = require("express");
const router = express.Router();

const ImpactControllers = require('../controllers/impact.controller.js');
// const uploadFile = require("../config/multer");

router
    .route("/")
    .get(ImpactControllers.index);

module.exports = router;