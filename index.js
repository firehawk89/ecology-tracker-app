const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const PORT = 3000;

const objectsRoutes = require("./routes/objects");
const pollutantsRoutes = require("./routes/pollutants");
const AppError = require("./utils/AppError");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/objects", objectsRoutes);
app.use("/pollutants", pollutantsRoutes);

app.get("/", (req, res) => {
  res.render("home", { message: "Hello, world!" });
});

app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Oh no, something went wrong!" } = err;

  console.log(err);

  res.status(status).render("error", { message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
