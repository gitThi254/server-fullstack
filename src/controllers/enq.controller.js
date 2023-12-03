const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Enquiry = require("../models/enquiry.model");

exports.createEnquiry = asyncErrorHandler(async (req, res, next) => {
  const createEnquiry = await Enquiry.create(req.body);
  res.json(createEnquiry);
});

exports.updateEnquiry = asyncErrorHandler(async (req, res, next) => {
  const updateEnquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!updateEnquiry)
    return next(
      new CustomError(`Enquiry with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: updateEnquiry,
  });
});

exports.deleteEnquiry = asyncErrorHandler(async (req, res, next) => {
  const deleteEnquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!deleteEnquiry)
    return next(
      new CustomError(`Enquiry with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: deleteEnquiry,
  });
});

exports.getEnquiry = asyncErrorHandler(async (req, res, next) => {
  const getEnquiry = await Enquiry.findById(req.params.id);
  if (!getEnquiry)
    return next(
      new CustomError(`Enquiry with id id: ${req.params.id} not found`, 404)
    );
  res.json({
    data: getEnquiry,
  });
});

exports.getallEnquiry = asyncErrorHandler(async (req, res, next) => {
  const getCategories = await Enquiry.find();

  res.json({
    data: getCategories,
  });
});
