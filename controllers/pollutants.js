const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");

module.exports.index = (req, res) => {
  res.render("pollutants/index");
};

module.exports.loadExcelData = (req, res) => {
  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  readXlsxFile(excelFile).then((rows) => {
    // Remove Header ROW
    rows.shift();

    mysqlPool.query(
      "INSERT INTO test2 (name, gdk) VALUES ?",
      [rows],
      (error, results) => {
        console.log(error || results);
      }
    );
  });

  res.redirect("/pollutants");
};
