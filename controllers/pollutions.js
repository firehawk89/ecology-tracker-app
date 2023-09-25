const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const objEmptyStrToNull = require("../utils/objEmptyStrToNull");
const pollutionService = require("../services/pollution");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const pollutionItems = await pollutionService.getAll();

  res.render("pollutions/index", { pollutionItems });
});

module.exports.renderNewPollutionForm = (req, res, next) => {
  res.render("pollutions/new");
};

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
    throw new AppError("File is not provided", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  try {
    await pollutionService.insertMany(rows);
  } catch {
    throw new AppError("Number of columns doesn't match or data is invalid.");
  }

  res.redirect("/pollutions");
});

// module.exports.renderEditPollutantForm = catchAsyncError(
//   async (req, res, next) => {
//     const { pollutantId } = req.params;

//     if (isNaN(pollutantId)) {
//       throw new AppError("Pollutant with given id not found.", 404);
//     }

//     const pollutant = await pollutionService.getById(pollutantId);

//     if (!pollutant) {
//       throw new AppError("Pollutant with given id not found.", 404);
//     }

//     res.render("pollutions/edit", { pollutant });
//   }
// );

// module.exports.updatePollutant = catchAsyncError(async (req, res, next) => {
//   const { pollutantId } = req.params;
//   const { pollutant } = req.body;

//   const transformedPollutant = objEmptyStrToNull(pollutant);

//   const result = await pollutionService.updateOneById(
//     pollutantId,
//     transformedPollutant
//   );

//   if (result === 0) {
//     throw new AppError("Pollutant with given id not found.", 404);
//   }

//   res.redirect("/pollutions");
// });

module.exports.deletePollution = catchAsyncError(async (req, res, next) => {
  const { pollutionId } = req.params;

  console.log(pollutionId);

  const result = await pollutionService.deleteOneById(pollutionId);

  if (result === 0) {
    throw new AppError("Pollution with given id not found.", 404);
  }

  res.redirect("/pollutions");
});
