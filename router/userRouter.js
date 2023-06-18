const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/signup", userController.singUp);
router.post("/signin", userController.singIn);
router.post("/logout", userController.logout);
router.put("/update-password", authMiddleware, userController.updatePassword);
router.put("/add-address", authMiddleware, userController.addUserAddress);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/get-role", authMiddleware, userController.getRole);

module.exports = router;
