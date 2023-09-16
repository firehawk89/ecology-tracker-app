const mysqlPool = require("../config/db");
const readXlsxFile = require("read-excel-file/node");

module.exports.index = (req, res) => {
  res.render("objects/index");
};

module.exports.loadExcelData = (req, res) => {
  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  readXlsxFile(excelFile).then((rows) => {
    // Remove Header ROW
    rows.shift();

    mysqlPool.query(
      "INSERT INTO test (name, description) VALUES ?",
      [rows],
      (error, results) => {
        console.log(error || results);
      }
    );
  });

  res.redirect("/objects");
};
