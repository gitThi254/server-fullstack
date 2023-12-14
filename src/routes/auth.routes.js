const { Router } = require("express");
const {
  createUser,
  login,
  getallUser,
  getUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  handlerRefreshToken,
  logout,
  forgotPassword,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  verifyToken,
  EditUser,
  removeProductFromCart,
  updateProductQuantityFromCart,
  getMyOrders,
  getaOrder,
} = require("../controllers/auth.controller");
const { validateSchema } = require("../middlewares/validator.middleware");
const { registerSchema, loginSchema } = require("../schemas/user.schema");
const { authRequired, isAdmin } = require("../middlewares/auth.middleware");
const {
  checkout,
  paymentVerfication,
} = require("../controllers/payment.controller");

const router = Router();

router.post("/register", validateSchema(registerSchema), createUser);
router.post("/login", validateSchema(loginSchema), login);
router.put("/edit-user", authRequired, updateUser);
router.post("/login-admin", validateSchema(loginSchema), loginAdmin);

router.post("/cart/applycoupon", authRequired, applyCoupon);
router.post("/cart/create-order", authRequired, createOrder);
// router.post("/cart/create-order", authRequired, createOrder);

router.post("/order/checkout", authRequired, checkout);

router.post("/order/paymentVerification", paymentVerfication);

router.get("/wishlist", authRequired, getWishList);

router.post("/cart", authRequired, userCart);
router.get("/cart", authRequired, getUserCart);
router.delete("/empty-cart", authRequired, emptyCart);
router.put(
  "/update-product-cart/:cartItemId/:newQuantity",
  authRequired,
  updateProductQuantityFromCart
);

router.delete("/delete-product-cart/:id", authRequired, removeProductFromCart);

router.put("/save-address", authRequired, saveAddress);

router.get("/verify", verifyToken);

router.post("/logout", logout);
router.get("/all-users", getallUser);
router.get("/refresh", handlerRefreshToken);
router.post("/forgot-passwork-token", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.get("/getmyorders", authRequired, getMyOrders);

router.get("/order/get-order", authRequired, isAdmin, getOrders);
router.get("/order/get-all-orders", authRequired, isAdmin, getAllOrders);
router.get("/order/:id", authRequired, getaOrder);
router
  .route("/:id")
  .get(authRequired, isAdmin, getUser)
  .put(authRequired, isAdmin, EditUser)
  .delete(authRequired, isAdmin, deleteUser);

router.put("/order/update-order/:id", authRequired, isAdmin, updateOrderStatus);
router.put("/block-user/:id", authRequired, isAdmin, blockUser);
router.put("/unblock-user/:id", authRequired, isAdmin, unblockUser);

module.exports = router;
