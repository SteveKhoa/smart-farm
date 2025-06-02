const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifyToken.middleware');
router.post('/login', authController.Login);
router.get('/me',verifyToken, authController.Me);
router.post('/logout',verifyToken, authController.Logout);
exports = module.exports = router;