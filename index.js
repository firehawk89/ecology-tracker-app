const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const PORT = 3000;

const objectsRoutes = require("./routes/object.routes");
const pollutantsRoutes = require("./routes/pollutant.routes");
const pollutionRoutes = require("./routes/pollution.routes");
const impactRoutes = require("./routes/impact.routes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/objects", objectsRoutes);
app.use("/pollutants", pollutantsRoutes);
app.use("/pollutions", pollutionRoutes);
app.use("/impact", impactRoutes);

app.get("/", (req, res) => {
  res.render("home", { message: "Hello, world!" });
});

app.get("*", (req, res, next) => {
  res.render("404");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Oh no, something went wrong!" } = err;

  console.log(err);

  res.status(status).render("error", { message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
