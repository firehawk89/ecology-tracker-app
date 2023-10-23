const catchAsyncError = require("../utils/catchAsyncError");
const objectServices = require("../services/object.services");

module.exports.index = catchAsyncError(async (req, res, next) => {
  const objects = await objectServices.getNames();

  res.render("impact/index", { objects });
});
