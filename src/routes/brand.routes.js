const { Router } = require("express");

const { authRequired, isAdmin } = require("../middlewares/auth.middleware");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../controllers/brand.controller");

const router = Router();

router
  .route("/")
  .get(authRequired, isAdmin, getallBrand)
  .post(authRequired, isAdmin, createBrand);
router
  .route("/:id")
  .get(getBrand)
  .put(authRequired, isAdmin, updateBrand)
  .delete(authRequired, isAdmin, deleteBrand);

module.exports = router;
