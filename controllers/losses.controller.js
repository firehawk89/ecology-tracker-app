const catchAsyncError = require("../utils/catchAsyncError");
const objectServices = require("../services/object.services");
const pollutionServices = require("../services/pollution.services");
const lossesServices = require("../services/losses.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const objects = await objectServices.getNames();

  res.render("losses/index", { objects });
});

module.exports.calculateLosses = catchAsyncError(async (req, res, next) => {
  const { losses } = req.body;
  const { object, year } = losses;

  const objects = await objectServices.getNames();
  let lossesData = [];
  let totalLosses = 0;

  if (!object && !year) {
    const objectIds = await objectServices.getIds();
    const pollutionYears = await pollutionServices.getYears();

    const promises = objectIds.flatMap(({ object_id }) =>
      pollutionYears.map(async ({ year }) => {
        const lossValue = await lossesServices.getSum(object_id, year);
        totalLosses += lossValue;
        return await lossesServices.getAll(object_id, year);
      })
    );

    const promisesResults = await Promise.all(promises);

    lossesData = promisesResults.flat();
  } else if (object && !year) {
    const objectId = await objectServices.getIdByName(object);
    const pollutionYears = await pollutionServices.getYears();

    const promises = pollutionYears.map(async ({ year }) => {
      const lossValue = await lossesServices.getSum(objectId, year);
      totalLosses += lossValue;
      return await lossesServices.getAll(objectId, year);
    });

    const promisesResults = await Promise.all(promises);

    lossesData = promisesResults.flat();
  } else if (!object && year) {
    const objectIds = await objectServices.getIds();

    const promises = objectIds.map(async ({ object_id }) => {
      const lossValue = await lossesServices.getSum(object_id, year);
      totalLosses += lossValue;
      return await lossesServices.getAll(object_id, year);
    });

    const promisesResults = await Promise.all(promises);

    lossesData = promisesResults.flat();
  } else {
    const objectId = await objectServices.getIdByName(object);
    totalLosses = await lossesServices.getSum(objectId, year);
    lossesData = await lossesServices.getAll(objectId, year);
  }

  res.render("losses/index", {
    object,
    year,
    objects,
    losses: lossesData,
    totalLosses,
  });
});
