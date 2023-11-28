const CustomError = require("../Utils/CustomError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (err.name === "CastError")
    err = new CustomError(
      `Invlalid value ${err.path} for field ${err.value}`,
      400
    );
  if (err.code === 11000) {
    err = err.keyValue.email
      ? new CustomError("email already exists, please use another email", 400)
      : err.keyValue.mobile
      ? new CustomError("mobile already exists, please use another mobile", 400)
      : err.keyValue.slug
      ? new CustomError("slug already exists, please use another slug", 400)
      : err;
  }
  // res.status(err.statusCode).json([err.message]);
  res.status(err.statusCode).json([err.stack]);
};
