const { Router } = require("express");

const { authRequired, isAdmin } = require("../middlewares/auth.middleware");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
} = require("../controllers/color.controller");

const router = Router();

router
  .route("/")
  .get(authRequired, isAdmin, getallColor)
  .post(authRequired, isAdmin, createColor);
router
  .route("/:id")
  .get(authRequired, isAdmin, getColor)
  .put(authRequired, isAdmin, updateColor)
  .delete(authRequired, isAdmin, deleteColor);

module.exports = router;
