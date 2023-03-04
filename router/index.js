const Router = require("express").Router;
const userRouter = require("./userRouter.js");
const productRouter = require("./productRouter.js");
const categoryRouter = require("./categoryRouter.js");
const brandRouter = require("./brandRouter.js");
const colorRouter = require("./colorRouter.js");

const router = new Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/brand", brandRouter);
router.use("/color", colorRouter);

module.exports = router;
