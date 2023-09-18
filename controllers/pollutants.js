const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");

module.exports.index = async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM pollutant");

    res.render("pollutants/index", { pollutantItems: rows });
  } catch (e) {
    next(new Error(e));
  }
};

module.exports.loadExcelData = (req, res, next) => {
  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  readXlsxFile(excelFile).then(async (rows) => {
    // Remove Header ROW
    rows.shift();

    try {
      await mysqlPool.query(
        "INSERT INTO pollutant (pollutant_name, gdk, min_mass_consumption, max_mass_consumption, danger_class) VALUES ?",
        [rows]
      );

      res.redirect("/pollutants");
    } catch (e) {
      next(new Error(e));
    }
  });
};
