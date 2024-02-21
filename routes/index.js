const express = require("express");
const router = express.Router();
const controls = require("../controllers/user");
const authChecker = require("../middlewares/authmiddleware");
const authentication = require("../controllers/auth");



router.get("/",controls.getAllUsers);

router.get("/:id",controls.getUserById);

router.delete("/",controls.deleteAllUsers);

router.delete("/:id",controls.deleteUserById);

router.post("/signup",authentication.register);

router.post("/forgot-password",authentication.forgotPassword);

router.post("/forgot-password/reset",authentication.resetToken);

router.post("/signin", authChecker.checkUser, authentication.signIn);

module.exports = router;