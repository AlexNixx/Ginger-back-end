const Router = require("express");
const router = new Router();

const orderController = require("../controllers/orderController");

const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post("/", authMiddleware, orderController.addOrderItems);

router.get("/my-orders", authMiddleware, orderController.getMyOrders);

router.get(
	"/statistic/:year",
	checkRoleMiddleware("ADMIN"),
	orderController.getStatisticYear
);

router.get(
	"/statistic/:year/:month",
	checkRoleMiddleware("ADMIN"),
	orderController.getStatisticMonth
);

router.get("/:id", authMiddleware, orderController.getOrderById);

router.put("/:id/pay", authMiddleware, orderController.updateOrderToPaid);

router.get("/", checkRoleMiddleware("ADMIN"), orderController.getAllOrders);

router.put(
	"/:id/delivered",
	checkRoleMiddleware("ADMIN"),
	orderController.updateOrderToDelivered
);

router.delete(
	"/:id",
	checkRoleMiddleware("ADMIN"),
	orderController.deleteOrder
);

module.exports = router;
