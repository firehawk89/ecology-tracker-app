const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const [rows] = await mysqlPool.query("SELECT * FROM object");

  res.render("objects/index", { objectItems: rows });
});

module.exports.loadExcelData = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("File is not provided", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  await mysqlPool.query(
    "INSERT INTO object (object_name, activity, ownership_form, address) VALUES ?",
    [rows]
  );

  res.redirect("/objects");
});
