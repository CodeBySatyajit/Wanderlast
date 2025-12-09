const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(WrapAsync(userController.signup));

router.route("/login")
    .get(userController.loginFormRender)
    .post(WrapAsync(userController.loginLogic));

// Logout route
router.get("/logout", userController.logout);

module.exports = router;