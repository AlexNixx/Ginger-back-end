const Router = require("express");
const router = new Router();

const productContoller = require("../controllers/productContoller");

const checkRoleMiddleware = require("../middlewares/checkRole-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/", productContoller.getAll);
router.post("/", checkRoleMiddleware("ADMIN"), productContoller.create);

router.get("/:id", productContoller.getOne);
router.put(
	"/:id",
	checkRoleMiddleware("ADMIN"),
	productContoller.updateProduct
);
router.delete(
	"/:id",
	checkRoleMiddleware("ADMIN"),
	productContoller.deleteProduct
);

router.post("/:id/reviews", authMiddleware, productContoller.createReview);
router.delete(
	"/:id/reviews/:reviewId",
	authMiddleware,
	productContoller.deleteReview
);

module.exports = router;
