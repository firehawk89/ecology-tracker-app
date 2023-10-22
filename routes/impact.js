const express = require("express");
const router = express.Router();

const ImpactControllers = require('../controllers/impact.js');
// const uploadFile = require("../config/multer");

router
    .route("/")
    .get(ImpactControllers.index);

module.exports = router;