const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");

module.exports.index = (req, res) => {
  res.render("objects/index");
};

module.exports.loadExcelData = (req, res, next) => {
  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  readXlsxFile(excelFile).then(async (rows) => {
    // Remove Header ROW
    rows.shift();

    try {
      await mysqlPool.query("INSERT INTO test (name, description) VALUES ?", [
        rows,
      ]);

      res.redirect("/objects");
    } catch (e) {
      next(new Error(e));
    }
  });
};
