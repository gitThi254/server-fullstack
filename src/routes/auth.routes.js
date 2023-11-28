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
} = require("../controllers/auth.controller");
const { validateSchema } = require("../middlewares/validator.middleware");
const { registerSchema, loginSchema } = require("../schemas/user.schema");
const { authRequired, isAdmin } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/register", validateSchema(registerSchema), createUser);
router.post("/login", validateSchema(loginSchema), login);
router.get("/logout", logout);
router.get("/all-users", getallUser);
router.get("/refresh", handlerRefreshToken);
router.post("/forgot-passwork-token", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.post("/");

router.route("/:id").get(authRequired, isAdmin, getUser).delete(deleteUser);

router.put("/edit-user", authRequired, updateUser);
router.put("/block-user/:id", authRequired, isAdmin, blockUser);
router.put("/unblock-user/:id", authRequired, isAdmin, unblockUser);

module.exports = router;
