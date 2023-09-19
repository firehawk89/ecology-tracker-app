const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");
const AppError = require("../utils/AppError");

module.exports.index = async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM object");

    res.render("objects/index", { objectItems: rows });
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

    await mysqlPool.query(
      "INSERT INTO object (object_name, activity, ownership_form, address) VALUES ?",
      [rows]
    );

    res.redirect("/objects");
  } catch (e) {
    next(new AppError("Provided excel file content is not valid", 422));
  }
};
