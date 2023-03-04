const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post(
	"/signup",
	body("email").isEmail(),
	body("password").isLength({ min: 3, max: 32 }),
	userController.singUp
);
router.post("/signin", userController.singIn);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get(
	"/users",
	authMiddleware,
	checkRoleMiddleware("USER"),
	userController.getUsers
);

module.exports = router;
