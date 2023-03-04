const Router = require("express");
const router = new Router();

const categoryContoller = require("../controllers/categoryContoller");

// const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

// router.post("/", checkRole("ADMIN"), categoryContoller.create);
router.post("/", categoryContoller.create);
router.get("/", categoryContoller.getAll);

module.exports = router;
