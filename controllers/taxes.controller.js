const catchAsyncError = require("../utils/catchAsyncError");
const objectServices = require("../services/object.services");
const pollutionServices = require("../services/pollution.services");
const taxesServices = require("../services/taxes.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const objects = await objectServices.getNames();

  res.render("taxes/index", { objects });
});

module.exports.calculateTaxes = catchAsyncError(async (req, res, next) => {
  const { taxes } = req.body;
  const { object, year } = taxes;

  const objects = await objectServices.getNames();
  const objectId = await objectServices.getIdByName(object);

  const pollutantIds = await pollutionServices.getPollutantIds();

  let taxesData = [];

  for (let i = 0; i < pollutantIds.length; i++) {
    const { pollutant_id } = pollutantIds[i];
    const taxData = await taxesServices.getAll(objectId, year, pollutant_id);
    taxesData.push(...taxData);
  }

  res.render("taxes/index", {
    object,
    year,
    objects,
    taxes: taxesData,
  });
});
