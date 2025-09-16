const express = require("express");
const userController = require("../controller/user.controller");
const router = express.Router();

router.get('/', userController.getRequest);
router.get('/get-user/:userId', userController.getUser);
router.delete("/delete-user/:userId", userController.deleteUser);
router.post('/forget-password',userController.forgetPassword);
router.post('/verify-fp',userController.verify);
router.post('/new-password',userController.newPassword);

module.exports = router;