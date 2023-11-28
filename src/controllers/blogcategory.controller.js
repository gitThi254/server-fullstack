const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Category = require("../models/blogCat.model");

exports.createCateogry = asyncErrorHandler(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.json(newCategory);
});

exports.updateCategory = asyncErrorHandler(async (req, res, next) => {
  const updateCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updateCategory)
    return next(
      new CustomError(`cateogry with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: updateCategory,
  });
});

exports.deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const deleteCategory = await Category.findByIdAndDelete(req.params.id);
  if (!deleteCategory)
    return next(
      new CustomError(`cateogry with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: deleteCategory,
  });
});

exports.getCategory = asyncErrorHandler(async (req, res, next) => {
  const getCategory = await Category.findById(req.params.id);
  if (!getCategory)
    return next(
      new CustomError(`cateogry with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: getCategory,
  });
});

exports.getallCategory = asyncErrorHandler(async (req, res, next) => {
  const getCategories = await Category.find();

  res.json({
    data: getCategories,
  });
});
