const Router = require("express");
const router = new Router();

const brandContoller = require("../controllers/brandContoller");

const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post("/", checkRoleMiddleware("ADMIN"), brandContoller.create);
router.get("/", brandContoller.getAll);
router.get("/:id", brandContoller.getOne);
router.put("/:id", checkRoleMiddleware("ADMIN"), brandContoller.updateBrand);
router.delete("/:id", checkRoleMiddleware("ADMIN"), brandContoller.deleteBrand);

module.exports = router;
