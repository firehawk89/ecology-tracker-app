const express = require("express");
const path = require("path");
const mysqlPool = require("./config/db");
const uploadFile = require("./config/multer");
const readXlsxFile = require("read-excel-file/node");

const app = express();
const PORT = 3000;

const objectsRoutes = require("./routes/objects");

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/objects", objectsRoutes);

app.get("/", (req, res) => {
  res.render("home", { message: "Hello, world!" });
});

app.post("/load-excel", uploadFile.single("load-excel"), async (req, res) => {
  await loadDataToDB(process.cwd() + "/uploads/" + req.file.filename);
  res.redirect("/");
});

function loadDataToDB(excelFile) {
  readXlsxFile(excelFile).then(async (rows) => {
    // Remove Header ROW
    rows.shift();

    await mysqlPool.query(
      "INSERT INTO test (name, description) VALUES ?",
      [rows],
      (error, results) => {
        console.log(error || results);
      }
    );
  });
}

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;

  if (!err.errorMessage) {
    err.errorMessage = "Oh no, something went wrong!";
  }

  console.error(err);
  res.status(statusCode).send(err.errorMessage);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
