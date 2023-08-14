const Router = require("express");
const router = new Router();

const colorController = require("../controllers/colorController");

const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post("/", checkRoleMiddleware("ADMIN"), colorController.create);
router.get("/", colorController.getAll);
router.get("/:id", colorController.getOne);
router.put("/:id", checkRoleMiddleware("ADMIN"), colorController.updateColor);
router.delete(
	"/:id",
	checkRoleMiddleware("ADMIN"),
	colorController.deleteColor
);

module.exports = router;
