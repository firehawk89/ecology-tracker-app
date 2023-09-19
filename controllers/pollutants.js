const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");
const AppError = require("../utils/AppError");

module.exports.index = async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM pollutant");

    res.render("pollutants/index", { pollutantItems: rows });
  } catch (e) {
    next(new Error(e));
  }
};

module.exports.loadExcelData = async (req, res, next) => {
  let excelFile;

  try {
    excelFile = process.cwd() + "/uploads/" + req.file.filename;
  } catch (e) {
    next(new AppError("File is not provided or not valid", 415));
  }

  try {
    const rows = await readXlsxFile(excelFile);
    rows.shift();

    // Store only necessary columns
    rows.forEach((row) => row.splice(5));

    await mysqlPool.query(
      "INSERT INTO pollutant (pollutant_name, gdk, min_mass_consumption, max_mass_consumption, danger_class) VALUES ?",
      [rows]
    );

    res.redirect("/pollutants");
  } catch (e) {
    next(new AppError("Provided excel file content is not valid", 422));
  }
};
