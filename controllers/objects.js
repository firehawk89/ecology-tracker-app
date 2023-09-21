const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const objectService = require("../services/object");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const objectItems = await objectService.getAll();

  res.render("objects/index", { objectItems });
});

module.exports.loadExcelData = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("File is not provided", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  await objectService.insertMany(rows);

  res.redirect("/objects");
});
