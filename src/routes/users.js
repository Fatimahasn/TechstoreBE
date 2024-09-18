const express = require("express");
const router = express.Router();
const { auth, authEmail, roleCheck} = require("../middleware");

const { userValidator } = require("../validators");
const { usersController } = require("../controllers");

router.post("/register",[userValidator.validateCreateUser],usersController.createUser);

router.post("/login",[userValidator.validateUserLogin],usersController.loginUser);

router.post("/update", auth, [userValidator.validateUpdateUser],usersController.updateUser);

router.post("/delete",auth,usersController.deleteUser);

router.get("/listUser", [auth], usersController.getUserDetails);

router.post("/verifyEmail", [authEmail], usersController.verifyEmailAddress);

router.get("/listAllUsers",[auth, roleCheck(["Admin"])], usersController.listAllUsers);

module.exports = router;
