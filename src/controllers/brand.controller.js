const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Brand = require("../models/brand.model");

exports.createBrand = asyncErrorHandler(async (req, res, next) => {
  const createBrand = await Brand.create(req.body);
  res.json(createBrand);
});

exports.updateBrand = asyncErrorHandler(async (req, res, next) => {
  const updateBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateBrand)
    return next(
      new CustomError(`brand with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: updateBrand,
  });
});

exports.deleteBrand = asyncErrorHandler(async (req, res, next) => {
  const deleteBrand = await Brand.findByIdAndDelete(req.params.id);
  if (!deleteBrand)
    return next(
      new CustomError(`brand with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: deleteBrand,
  });
});

exports.getBrand = asyncErrorHandler(async (req, res, next) => {
  const getBrand = await Brand.findById(req.params.id);
  if (!getBrand)
    return next(
      new CustomError(`brand with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: getBrand,
  });
});

exports.getallBrand = asyncErrorHandler(async (req, res, next) => {
  const getCategories = await Brand.find();

  res.json({
    data: getCategories,
  });
});
