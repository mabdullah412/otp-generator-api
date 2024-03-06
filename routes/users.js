const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post("/signup", userController.create);

router.delete("/:user_id", userController.remove);

router.patch("/:user_id", userController.update);

module.exports = router;
