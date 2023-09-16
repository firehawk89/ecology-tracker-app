const express = require("express");
const router = express.Router();

const objects = require("../controllers/objects");

router.route("/").get(objects.index);

module.exports = router;
