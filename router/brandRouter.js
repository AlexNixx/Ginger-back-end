const Router = require("express");
const router = new Router();

const brandContoller = require("../controllers/brandContoller");

const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post("/", checkRoleMiddleware("ADMIN"), brandContoller.create);
router.get("/", brandContoller.getAll);

module.exports = router;
