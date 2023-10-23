const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const objEmptyStrToNull = require("../utils/objEmptyStrToNull");
const populationServices = require("../services/population.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const populationItems = await populationServices.getAll();

  res.render("population/index", { populationItems });
});

module.exports.renderNewPopulationForm = (req, res, next) => {
  res.render("population/new");
};

module.exports.addNewPopulation = catchAsyncError(async (req, res, next) => {
  const { population } = req.body;

  const transformedPopulation = objEmptyStrToNull(population);

  try {
    await populationServices.insertOne(transformedPopulation);
  } catch {
    throw new AppError("Entered data is invalid.", 422);
  }

  res.redirect("/population");
});

module.exports.loadFromExcel = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("File is not provided.", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  try {
    await populationServices.insertMany(rows);
  } catch {
    throw new AppError("Number of columns doesn't match or data is invalid.");
  }

  res.redirect("/population");
});

module.exports.renderEditPopulationForm = catchAsyncError(
  async (req, res, next) => {
    const { populationId } = req.params;

    if (isNaN(populationId)) {
      throw new AppError("Population with given id not found.", 404);
    }

    const population = await populationServices.getById(populationId);

    if (!population) {
      throw new AppError("Population with given id not found.", 404);
    }

    res.render("population/edit", { population });
  }
);

module.exports.updatePopulation = catchAsyncError(async (req, res, next) => {
  const { populationId } = req.params;
  const { population } = req.body;

  const transformedPopulation = objEmptyStrToNull(population);

  const result = await populationServices.updateOneById(
    populationId,
    transformedPopulation
  );

  if (result === 0) {
    throw new AppError("Population with given id not found.", 404);
  }

  res.redirect("/population");
});

module.exports.deletePopulation = catchAsyncError(async (req, res, next) => {
  const { populationId } = req.params;

  const result = await populationServices.deleteOneById(populationId);

  if (result === 0) {
    throw new AppError("Population with given id not found.", 404);
  }

  res.redirect("/population");
});
