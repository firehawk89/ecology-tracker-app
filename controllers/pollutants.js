const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const [rows] = await mysqlPool.query("SELECT * FROM pollutant");

  res.render("pollutants/index", { pollutantItems: rows });
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

  await mysqlPool.query(
    "INSERT INTO pollutant (pollutant_name, gdk, min_mass_consumption, max_mass_consumption, danger_class) VALUES ?",
    [rows]
  );

  res.redirect("/pollutants");
});
