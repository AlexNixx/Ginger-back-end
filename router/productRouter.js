const Router = require("express");
const router = new Router();

const productContoller = require("../controllers/productContoller");

// const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

// router.post("/", checkRole("ADMIN"), deviceController.create);
router.post("/", productContoller.create);
router.get("/", productContoller.getAll);
router.get("/:id", productContoller.getOne);

module.exports = router;
