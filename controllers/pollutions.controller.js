const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const objEmptyStrToNull = require("../utils/objEmptyStrToNull");
const pollutionServices = require("../services/pollution.services");
const pollutantServices = require("../services/pollutant.services");
const objectServices = require("../services/object.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const pollutionItems = await pollutionServices.getAll();

  res.render("pollutions/index", { pollutionItems });
});

module.exports.renderNewPollutionForm = catchAsyncError(
  async (req, res, next) => {
    const pollutants = await pollutantServices.getNames();
    const objects = await objectServices.getNames();
    res.render("pollutions/new", { pollutants, objects });
  }
);

module.exports.addNewPollution = catchAsyncError(async (req, res, next) => {
  const { pollution } = req.body;

  const transformedPollution = objEmptyStrToNull(pollution);

  try {
    await pollutionServices.insertOne(transformedPollution);
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
    await pollutionServices.insertMany(rows);
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

    const pollution = await pollutionServices.getById(pollutionId);

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
    const result = await pollutionServices.updateOneById(
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

  const result = await pollutionServices.deleteOneById(pollutionId);

  if (result === 0) {
    throw new AppError("Pollution with given id not found.", 404);
  }

  res.redirect("/pollutions");
});
