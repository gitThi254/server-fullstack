const { Router } = require("express");
const {
  createBlog,
  updateBlogs,
  getBlog,
  getallBlogs,
  deleteBlogs,
  likeBlog,
  disLikeBlog,
} = require("../controllers/blog.controller");
const { isAdmin, authRequired } = require("../middlewares/auth.middleware");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");
const { uploadImages } = require("../controllers/product.controller");
const router = Router();

router.route("/").get(getallBlogs).post(authRequired, isAdmin, createBlog);

router.route("/likes").put(authRequired, isAdmin, likeBlog);
router.route("/dislikes").put(authRequired, isAdmin, disLikeBlog);

router.put(
  "/upload/:id",
  authRequired,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);

router
  .route("/:id")
  .get(getBlog)
  .put(authRequired, isAdmin, updateBlogs)
  .delete(authRequired, isAdmin, deleteBlogs);

module.exports = router;
