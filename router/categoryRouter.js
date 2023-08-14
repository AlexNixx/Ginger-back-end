const Router = require("express");
const router = new Router();

const categoryContoller = require("../controllers/categoryContoller");

const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post("/", checkRoleMiddleware("ADMIN"), categoryContoller.create);
router.get("/", categoryContoller.getAll);
router.get("/:id", categoryContoller.getOne);
router.put(
	"/:id",
	checkRoleMiddleware("ADMIN"),
	categoryContoller.updateCategory
);
router.delete(
	"/:id",
	checkRoleMiddleware("ADMIN"),
	categoryContoller.deleteCategory
);

module.exports = router;
