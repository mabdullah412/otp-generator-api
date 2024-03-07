const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.get("/", userController.get);
router.post("/", userController.create);

router.post("/generateOTP", userController.generateOTP);
router.get("/:user_id/verifyOTP", userController.verifyOTP);

router.delete("/:user_id", userController.remove);
router.patch("/:user_id", userController.update);

module.exports = router;
