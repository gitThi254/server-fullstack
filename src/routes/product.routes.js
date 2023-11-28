const { Router } = require("express");
const router = Router();

const {
  createProduct,
  getallProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  // uploadImages,
} = require("../controllers/product.controller");
const { authRequired, isAdmin } = require("../middlewares/auth.middleware");
// const {
//   uploadPhoto,
//   productImgResize,
// } = require("../middlewares/uploadImages");

router.route("/").get(getallProduct).post(authRequired, isAdmin, createProduct);

// router.put(
//   "/upload/:id",
//   authRequired,
//   isAdmin,
//   uploadPhoto.array("images", 2),
//   productImgResize,
//   uploadImages
// );
router.put("/wishlist", authRequired, addToWishlist);
router.put("/rating", authRequired, rating);

router
  .route("/:id")
  .get(getProduct)
  .put(authRequired, isAdmin, updateProduct)
  .delete(authRequired, isAdmin, deleteProduct);

module.exports = router;
