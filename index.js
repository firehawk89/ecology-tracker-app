require("dotenv").config();
const express = require("express");
const path = require("path");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
});

connection.connect((err) => {
  if (err) {
    return console.error(`MySQL connection error: ${err.message}`);
  } else {
    return console.log("Successfully connected to MySQL");
  }
});

const query = `SELECT * FROM test`;

connection.query(query, (err, results) => {
  console.log(err);
  console.log(results);
});

app.get("/", (req, res) => {
  res.render("home", { message: "Hello, world!" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

connection.end((err) => {
  if (err) {
    return console.error(`MySQL connection error: ${err.message}`);
  } else {
    return console.log("MySQL connection successfully closed!");
  }
});
