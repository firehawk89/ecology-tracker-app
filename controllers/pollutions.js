const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const objEmptyStrToNull = require("../utils/objEmptyStrToNull");
const pollutionService = require("../services/pollution");
const pollutantService = require("../services/pollutant")

module.exports.index = catchAsyncError(async (req, res, next) => {
  const pollutionItems = await pollutionService.getAll();

  res.render("pollutions/index", { pollutionItems });
});

module.exports.renderNewPollutionForm = catchAsyncError(async (req, res, next) => {
  const pollutants = await pollutantService.getNames();
  res.render("pollutions/new", {pollutants});
});

module.exports.addNewPollution = catchAsyncError(async (req, res, next) => {
  const { pollution } = req.body;

  const transformedPollution = objEmptyStrToNull(pollution);

  try {
    await pollutionService.insertOne(transformedPollution);
  } catch {
    throw new AppError("Entered data is invalid.", 422);
  }

  res.redirect("/pollutions");
});

module.exports.loadFromExcel = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("File is not provided.", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  try {
    await pollutionService.insertMany(rows);
  } catch {
    throw new AppError(
      "Number of columns doesn't match or data is invalid.",
      422
    );
  }

  res.redirect("/pollutions");
});

module.exports.renderEditPollutionForm = catchAsyncError(
  async (req, res, next) => {
    const { pollutionId } = req.params;

    if (isNaN(pollutionId)) {
      throw new AppError("Pollution with given id not found.", 404);
    }

    const pollution = await pollutionService.getById(pollutionId);

    if (!pollution) {
      throw new AppError("Pollution with given id not found.", 404);
    }

    res.render("pollutions/edit", { pollution });
  }
);

module.exports.updatePollution = catchAsyncError(async (req, res, next) => {
  const { pollutionId } = req.params;
  const { pollution } = req.body;

  const transformedPollution = objEmptyStrToNull(pollution);

  try {
    const result = await pollutionService.updateOneById(
      pollutionId,
      transformedPollution
    );

    if (result === 0) {
      throw new AppError("Pollution with given id not found.", 404);
    }
  } catch {
    throw new AppError("Entered data is invalid.", 422);
  }

  res.redirect("/pollutions");
});

module.exports.deletePollution = catchAsyncError(async (req, res, next) => {
  const { pollutionId } = req.params;

  console.log(pollutionId);

  const result = await pollutionService.deleteOneById(pollutionId);

  if (result === 0) {
    throw new AppError("Pollution with given id not found.", 404);
  }

  res.redirect("/pollutions");
});
