const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const User = require("../models/user.model");

exports.authRequired = asyncErrorHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return next(new CustomError("You are not logged in", 404));
  jwt.verify(
    refreshToken,
    process.env.SECRET_JWT,
    async (err, refreshToken) => {
      if (err)
        return next(
          new CustomError("Invalid or token expired, you are loggin again", 401)
        );
      const user = await User.findById(refreshToken.id);
      if (!user) return next(new CustomError("User not found", 404));
      req.user = user;
      next();
    }
  );
});

exports.isAdmin = asyncErrorHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return next(new CustomError("You are not an admin", 400));
  }
  next();
});
