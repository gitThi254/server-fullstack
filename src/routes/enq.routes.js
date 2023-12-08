const { Router } = require("express");

const { authRequired, isAdmin } = require("../middlewares/auth.middleware");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../controllers/enq.controller");

const router = Router();

router
  .route("/")
  .get(authRequired, isAdmin, getallEnquiry)
  .post(authRequired, isAdmin, createEnquiry);
router
  .route("/:id")
  .get(authRequired, isAdmin, getEnquiry)
  .put(authRequired, isAdmin, updateEnquiry)
  .delete(authRequired, isAdmin, deleteEnquiry);

module.exports = router;
