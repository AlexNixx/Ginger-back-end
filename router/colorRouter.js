const Router = require("express");
const router = new Router();

const colorController = require("../controllers/colorController");

const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post("/", checkRoleMiddleware("ADMIN"), colorController.create);
router.get("/", colorController.getAll);

module.exports = router;
