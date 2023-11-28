const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Coupon = require("../models/coupon.model");

exports.createCoupon = asyncErrorHandler(async (req, res, next) => {
  const newCoupon = await Coupon.create(req.body);
  res.json({
    data: newCoupon,
  });
});

exports.getallCoupon = asyncErrorHandler(async (req, res, next) => {
  const getallCoupon = await Coupon.find();
  res.json({
    data: getallCoupon,
  });
});

exports.updateConpon = asyncErrorHandler(async (req, res, next) => {
  const updateCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateCoupon)
    return next(
      new CustomError(`Coupon with id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: updateCoupon,
  });
});

exports.deleteConpon = asyncErrorHandler(async (req, res, next) => {
  const deleteCoupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!deleteCoupon)
    return next(
      new CustomError(`Coupon with id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: deleteCoupon,
  });
});

exports.getConpon = asyncErrorHandler(async (req, res, next) => {
  const getConpon = await Coupon.findById(req.params.id);
  if (!getConpon)
    return next(
      new CustomError(`Coupon with id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: getConpon,
  });
});
