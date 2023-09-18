const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");

module.exports.index = async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM object");

    res.render("objects/index", { objectItems: rows });
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
        "INSERT INTO object (object_name, activity, ownership_form, address) VALUES ?",
        [rows]
      );

      res.redirect("/objects");
    } catch (e) {
      next(new Error(e));
    }
  });
};
