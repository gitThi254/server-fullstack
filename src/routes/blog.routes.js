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

const router = Router();

router
  .route("/")
  .get(authRequired, getallBlogs)
  .post(authRequired, isAdmin, createBlog);

router.route("/likes").put(authRequired, likeBlog);
router.route("/dislikes").put(authRequired, disLikeBlog);

router
  .route("/:id")
  .get(getBlog)
  .put(authRequired, isAdmin, updateBlogs)
  .delete(authRequired, isAdmin, deleteBlogs);

module.exports = router;
