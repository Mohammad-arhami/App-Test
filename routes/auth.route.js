const express = require("express");
const authController = require("../controller/auth.controller");
const router = express.Router();

router.get('/', authController.getRequest);
router.post('/signup', authController.signUp);
router.post('/verify', authController.verify);
router.post('/login', authController.login);

module.exports = router;