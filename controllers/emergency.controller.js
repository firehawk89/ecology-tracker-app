const catchAsyncError = require("../utils/catchAsyncError");
const objectServices = require("../services/object.services");
const pollutionServices = require("../services/pollution.services");
const emergencyServices = require("../services/emergency.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const objects = await objectServices.getNames();

  res.render("emergency/index", { objects });
});

module.exports.calculateEmergency = catchAsyncError(async (req, res, next) => {
  const { emergency } = req.body;
  const { object, year } = emergency;

  const objects = await objectServices.getNames();
  const objectId = await objectServices.getIdByName(object);

  const emergencyData = await emergencyServices.getAll(objectId, year);

  res.render("emergency/index", {
    object,
    year,
    objects,
    emergency: emergencyData,
  });
});
