const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const pollutantService = require("../services/pollutant");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const pollutantItems = await pollutantService.getAll();

  res.render("pollutants/index", { pollutantItems });
});

module.exports.loadExcelData = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("File is not provided", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  // Store only necessary columns
  rows.forEach((row) => row.splice(5));

  await pollutantService.insertMany(rows);

  res.redirect("/pollutants");
});
