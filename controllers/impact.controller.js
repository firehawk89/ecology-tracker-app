const catchAsyncError = require("../utils/catchAsyncError");
const objectServices = require("../services/object.services");
const AppError = require("../utils/AppError");
const impactServices = require("../services/impact.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const objects = await objectServices.getNames();

  res.render("impact/index", { objects });
});

module.exports.calculateImpact = catchAsyncError(async (req, res, next) => {
  const objects = await objectServices.getNames();
  const { impact } = req.body;

  let objectId;
  try {
    objectId = await objectServices.getIdByName(impact.object);
  } catch {
    throw new AppError("Object with given name not found.", 404);
  }

  let nonCarcinogenicRisks;
  try {
    nonCarcinogenicRisks = await impactServices.getNonCarcinogenicRisks(
      objectId,
      impact.year
    );
  } catch {
    throw new AppError("Provided data is invalid.", 404);
  }

  let hqSum;
  try {
    hqSum = await impactServices.getHqSum(objectId, impact.year);
  } catch {
    throw new AppError("Provided data is invalid.", 404);
  }

  let carcinogenicRisks;
  try {
    carcinogenicRisks = await impactServices.getCarcinogenicRisks(
      objectId,
      impact.year
    );
  } catch {
    throw new AppError("Provided data is invalid.", 404);
  }

  let crSum;
  try {
    crSum = await impactServices.getCrSum(objectId, impact.year);
  } catch {
    throw new AppError("Provided data is invalid.", 404);
  }

  let pcr;
  try {
    pcr = await impactServices.getPcr(objectId, impact.year);
  } catch {
    throw new AppError("Provided data is invalid.", 404);
  }

  res.render("impact/index", {
    objects,
    object: impact.object,
    year: impact.year,
    nonCarcinogenicRisks,
    hq: hqSum,
    carcinogenicRisks,
    cr: crSum,
    pcr,
  });
});
