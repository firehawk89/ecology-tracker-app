const readXlsxFile = require("read-excel-file/node");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const objEmptyStrToNull = require("../utils/objEmptyStrToNull");
const objectService = require("../services/object");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const objectItems = await objectService.getAll();

  res.render("objects/index", { objectItems });
});

module.exports.renderNewObjectForm = (req, res, next) => {
  res.render("objects/new");
};

module.exports.addNewObject = catchAsyncError(async (req, res, next) => {
  const { object } = req.body;

  const transformedObject = objEmptyStrToNull(object);

  try {
    await objectService.insertOne(transformedObject);
  } catch {
    throw new AppError("Entered data is invalid.", 422);
  }

  res.redirect("/objects");
});

module.exports.loadFromExcel = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("File is not provided", 415);
  }

  const excelFile = process.cwd() + "/uploads/" + req.file.filename;

  const rows = await readXlsxFile(excelFile);
  rows.shift();

  try {
    await objectService.insertMany(rows);
  } catch {
    throw new AppError("Number of columns doesn't match or data is invalid.");
  }

  res.redirect("/objects");
});

module.exports.renderEditObjectForm = catchAsyncError(
  async (req, res, next) => {
    const { objectId } = req.params;

    if (isNaN(objectId)) {
      throw new AppError("Object with given id not found.", 404);
    }

    const object = await objectService.getById(objectId);

    if (!object) {
      throw new AppError("Object with given id not found.", 404);
    }

    res.render("objects/edit", { object });
  }
);

module.exports.updateObject = catchAsyncError(async (req, res, next) => {
  const { objectId } = req.params;
  const { object } = req.body;

  const result = await objectService.updateOneById(objectId, object);

  if (result === 0) {
    throw new AppError("Object with given id not found.", 404);
  }

  res.redirect("/objects");
});

module.exports.deleteObject = catchAsyncError(async (req, res, next) => {
  const { objectId } = req.params;

  await objectService.deleteOneById(objectId);

  res.redirect("/objects");
});
