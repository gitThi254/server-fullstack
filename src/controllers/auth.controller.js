const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const sendEmail = require("../Utils/email");
const createAccessToken = require("../libs/jwt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");
const uniqid = require("uniqid");

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

exports.loginAdmin = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin")
    return next(new CustomError("Not Authorised", 403));
  if (findAdmin && (await findAdmin.comparePW(password))) {
    const refreshToken = await createAccessToken({ id: findAdmin?._id });
    await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: refreshToken,
    });
  } else {
    return next(new CustomError("Invalid Credentials", 403));
  }
});

exports.getWishList = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const findUser = await User.findById(_id).populate("wishlist");
  res.json(findUser);
});

exports.saveAddress = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const updateUser = await User.findOneAndUpdate(
    _id,
    {
      address: req?.body?.address,
    },
    {
      new: true,
    }
  );
  res.json(updateUser);
});

exports.userCart = asyncErrorHandler(async (req, res, next) => {
  const { cart } = req.body;
  const { _id } = req.user;
  let products = [];
  const user = await User.findById(_id);
  const alreadyExistCart = await Cart.findOne({ orderby: user._id });
  if (alreadyExistCart) {
    alreadyExistCart.remove();
  }
  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    let getPrice = await Product.findById(cart[i]._id).select("price").exec();
    object.price = getPrice.price;
    products.push(object);
  }
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal += products[i].price * products[i].count;
  }
  const newCart = await Cart.create({
    products,
    cartTotal,
    orderby: user?._id,
  });
  res.json({
    data: newCart,
  });
});

exports.getUserCart = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const cart = await Cart.findOne({ orderby: _id }).populate(
    "products.product",
    "_id title price totalAfterDiscount"
  );
  res.json({
    data: cart,
  });
});

exports.emptyCart = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id });
  const cart = await Cart.findOneAndDelete({ orderby: user._id });
  res.json(cart);
});

exports.applyCoupon = asyncErrorHandler(async (req, res, next) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) {
    return next(new CustomError("Invalid Coupon", 400));
  }

  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: _id,
  }).populate("products.product");
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  console.log(user._id);

  await Cart.findOneAndUpdate(
    {
      orderby: _id,
    },
    {
      totalAfterDiscount,
    },
    {
      new: true,
    }
  );
  res.json(totalAfterDiscount);
});

exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  if (!COD) return next(new CustomError("Create cash order faild", 400));
  const user = await User.findById(_id);
  let finalAmout = 0;

  let userCart = await Cart.findOne({ orderby: user._id });
  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmout = userCart.totalAfterDiscount;
  } else {
    finalAmout = userCart.cartTotal;
  }

  let newOrder = await Order.create({
    products: userCart.products,
    paymentIntent: {
      id: uniqid(),
      method: "COD",
      amount: finalAmout,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: "usd",
    },
    orderby: user._id,
    orderStatus: "Cash on Delivery",
  });
  let update = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quanity: -item.count, sold: +item.count } },
      },
    };
  });
  const updated = await Product.bulkWrite(update, {});
  res.json({ message: "success" });
});

exports.getOrders = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const userorders = await Order.findOne({ orderby: _id }).populate(
    "products.product"
  );
  res.json(userorders);
});

exports.updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  const findOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: status,
      paymentIntent: {
        status: status,
      },
    },
    {
      new: true,
    }
  );
  res.json({
    data: findOrder,
  });
});
