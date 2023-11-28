const { Router } = require("express");
const {
  createCoupon,
  getallCoupon,
  getConpon,
  deleteConpon,
  updateConpon,
} = require("../controllers/coupon.controller");
const { authRequired, isAdmin } = require("../middlewares/auth.middleware");
const router = Router();

router
  .route("/")
  .get(authRequired, isAdmin, getallCoupon)
  .post(authRequired, isAdmin, createCoupon);

router
  .route("/:id")
  .get(authRequired, isAdmin, getConpon)
  .put(authRequired, isAdmin, updateConpon)
  .delete(authRequired, isAdmin, deleteConpon);

module.exports = router;
