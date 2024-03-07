const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const userRouter = require("./users");

router.get("/", controllers.index);
router.use("/users", userRouter);

module.exports = router;
