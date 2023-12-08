const { Router } = require("express");
const {
  createCateogry,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controllers/blogcategory.controller");
const { authRequired, isAdmin } = require("../middlewares/auth.middleware");

const router = Router();

router
  .route("/")
  .get(authRequired, isAdmin, getallCategory)
  .post(authRequired, isAdmin, createCateogry);
router
  .route("/:id")
  .get(getCategory)
  .put(authRequired, isAdmin, updateCategory)
  .delete(authRequired, isAdmin, deleteCategory);

module.exports = router;
