const express = require('express');
const cookieParser = require('cookie-parser');
const authController = require('../controllers/auth');

const router = express.Router();

router.use(cookieParser());

router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);



module.exports = router;
