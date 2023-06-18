const Router = require("express");
const router = new Router();

const orderController = require("../controllers/orderController");

const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post("/", authMiddleware, orderController.addOrderItems);

router.get("/", checkRoleMiddleware("ADMIN"), orderController.getAllOrders);

router.get("/my-orders", authMiddleware, orderController.getMyOrders);

router.get("/:id", authMiddleware, orderController.getOrderById);

router.put("/:id/pay", authMiddleware, orderController.updateOrderToPaid);

router.put(
	"/:id/deliver",
	checkRoleMiddleware("ADMIN"),
	orderController.updateOrderToDeliver
);

module.exports = router;
