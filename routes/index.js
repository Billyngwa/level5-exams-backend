const express = require("express");
const router = express.Router();
const controls = require("../controllers/user");
const authChecker = require("../middlewares/authmiddleware");
const authentication = require("../controllers/auth");

const article = require("../controllers/articles");


router.get("/",controls.getAllUsers);

router.get("/:id",controls.getUserById);

router.delete("/",controls.deleteAllUsers);

router.delete("/:id",controls.deleteUserById);

router.post("/signup",authentication.register);

router.post("/forgot-password",authentication.forgotPassword);

router.post("/forgot-password/reset",authentication.resetToken);

router.post("/signin", authChecker.checkUser, authentication.signIn);

router.get("/",article.getAllArticles);

router.get("/:id",article.getArticlesById);

router.patch("/:id",article.updateArticle);

router.post("/post",article.createArticle);

module.exports = router;