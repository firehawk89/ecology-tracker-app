const catchAsyncError = require("../utils/catchAsyncError");

module.exports.index = catchAsyncError(async (req, res, next) => {
    res.render("impact/index");
});