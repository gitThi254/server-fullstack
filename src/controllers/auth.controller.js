const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const sendEmail = require("../Utils/email");
const createAccessToken = require("../libs/jwt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    data: newUser,
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePW(req.body.password))) {
    return next(new CustomError("Incorrect in Email && Password ", 401));
  }
  const refreshToken = await createAccessToken({ id: user._id });
  const updateUser = await User.findByIdAndUpdate(
    user._id,
    { refreshToken: refreshToken },
    { new: true }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  res.json({
    data: {
      id: updateUser._id,
      firstname: updateUser.firstname,
      lastname: updateUser.lastname,
      email: updateUser.email,
      mobile: updateUser.mobile,
      token: refreshToken,
    },
  });
});

exports.handlerRefreshToken = asyncErrorHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    return next(new CustomError("No Refetch Token in cookie", 401));
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user)
    return next(
      new CustomError("No Refresh present in db or not matched", 400)
    );
  jwt.verify(refreshToken, process.env.SECRET_JWT, async (err, decoded) => {
    if (err || user.id !== decoded.id)
      return next(
        new CustomError("There is something wrong with refresh token", 400)
      );
    const accessToken = await createAccessToken({ id: user._id });
    res.json({ accessToken });
  });
});

exports.getallUser = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();
  res.json({
    data: users,
  });
});

exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new CustomError(`user with ID: ${req.params.id} not found`, 404)
    );
  res.status(200).json({
    data: user,
  });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user)
    return next(
      new CustomError(`user with ID: ${req.params.id} not found`, 404)
    );
  res.status(200).json({
    data: user,
  });
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return next(
      new CustomError(`user with ID: ${req.params.id} not found`, 404)
    );
  res.status(200).json({
    data: user,
  });
});

exports.blockUser = asyncErrorHandler(async (req, res, next) => {
  const block = await User.findByIdAndUpdate(
    req.params.id,
    { isBlock: true },
    { new: true }
  );
  if (!block) return next(new CustomError("User not found", 404));
  res.json({
    message: "User Blocked",
  });
});
exports.unblockUser = asyncErrorHandler(async (req, res, next) => {
  const unblock = await User.findByIdAndUpdate(
    req.params.id,
    { isBlock: false },
    { new: true }
  );
  if (!unblock) return next(new CustomError("User not found", 404));
  res.json({
    message: "User unBlocked",
  });
});

exports.logout = asyncErrorHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    return next(new CustomError("No Refresh Token in cookies", 400));
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(user._id, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = new CustomError(
      "We could not find the user with even email",
      404
    );
    next(error);
  }
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to rest your passsord\n\n${resetUrl}\n\nThis rsest password link will be valid only for 10 minutes.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password change request rerceived",
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "password reset link send to the user email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new CustomError(
        "There was an error sending password rest email. Please try again later",
        500
      )
    );
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
  });
  if (!user) {
    const error = new CustomError("Token is invalid or has expired", 400);
    next(error);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  user.save();
  res.status(200).json({
    status: "success",
    message: "reset password successfully",
  });
});
