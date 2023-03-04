const Router = require("express");
const router = new Router();

const brandContoller = require("../controllers/brandContoller");

// const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

// router.post("/", checkRole("ADMIN"), brandContoller.create);
router.post("/", brandContoller.create);
router.get("/", brandContoller.getAll);

module.exports = router;
