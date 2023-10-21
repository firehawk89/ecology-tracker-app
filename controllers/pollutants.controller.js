const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const objEmptyStrToNull = require("../utils/objEmptyStrToNull");
const pollutantServices = require("../services/pollutant.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const pollutantItems = await pollutantServices.getAll();

  res.render("pollutants/index", { pollutantItems });
});

module.exports.renderNewPollutantForm = (req, res, next) => {
  res.render("pollutants/new");
};

module.exports.addNewPollutant = catchAsyncError(async (req, res, next) => {
  const { pollutant } = req.body;

  const transformedPollutant = objEmptyStrToNull(pollutant);

  try {
    await pollutantServices.insertOne(transformedPollutant);
  } catch {
    throw new AppError("Entered data is invalid.", 422);
  }

  res.redirect("/pollutants");
});

module.exports.loadFromExcel = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("File is not provided.", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  //   // Store only necessary columns
  //   rows.forEach((row) => row.splice(5));

  try {
    await pollutantServices.insertMany(rows);
  } catch {
    throw new AppError("Number of columns doesn't match or data is invalid.");
  }

  res.redirect("/pollutants");
});

module.exports.renderEditPollutantForm = catchAsyncError(
  async (req, res, next) => {
    const { pollutantId } = req.params;

    if (isNaN(pollutantId)) {
      throw new AppError("Pollutant with given id not found.", 404);
    }

    const pollutant = await pollutantServices.getById(pollutantId);

    if (!pollutant) {
      throw new AppError("Pollutant with given id not found.", 404);
    }

    res.render("pollutants/edit", { pollutant });
  }
);

module.exports.updatePollutant = catchAsyncError(async (req, res, next) => {
  const { pollutantId } = req.params;
  const { pollutant } = req.body;

  const transformedPollutant = objEmptyStrToNull(pollutant);

  const result = await pollutantServices.updateOneById(
    pollutantId,
    transformedPollutant
  );

  if (result === 0) {
    throw new AppError("Pollutant with given id not found.", 404);
  }

  res.redirect("/pollutants");
});

module.exports.deletePollutant = catchAsyncError(async (req, res, next) => {
  const { pollutantId } = req.params;

  const result = await pollutantServices.deleteOneById(pollutantId);

  if (result === 0) {
    throw new AppError("Pollutant with given id not found.", 404);
  }

  res.redirect("/pollutants");
});
