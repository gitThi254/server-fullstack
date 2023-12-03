const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Color = require("../models/color.model");

exports.createColor = asyncErrorHandler(async (req, res, next) => {
  const createColor = await Color.create(req.body);
  res.json(createColor);
});

exports.updateColor = asyncErrorHandler(async (req, res, next) => {
  const updateColor = await Color.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateColor)
    return next(
      new CustomError(`Color with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: updateColor,
  });
});

exports.deleteColor = asyncErrorHandler(async (req, res, next) => {
  const deleteColor = await Color.findByIdAndDelete(req.params.id);
  if (!deleteColor)
    return next(
      new CustomError(`Color with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: deleteColor,
  });
});

exports.getColor = asyncErrorHandler(async (req, res, next) => {
  const getColor = await Color.findById(req.params.id);
  if (!getColor)
    return next(
      new CustomError(`Color with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: getColor,
  });
});

exports.getallColor = asyncErrorHandler(async (req, res, next) => {
  const getCategories = await Color.find();

  res.json({
    data: getCategories,
  });
});
