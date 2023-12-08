const { Router } = require("express");
const { authRequired, isAdmin } = require("../middlewares/auth.middleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");
const {
  uploadImages,
  deleteImages,
} = require("../controllers/upload.controller");
const router = Router();

router.post(
  "/",
  authRequired,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:id", authRequired, isAdmin, deleteImages);

module.exports = router;
