const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// router.get('/api/statistics/total-users', userController.getTotalUsersCount);
router.get('/statistics/user-roles', userController.getUserRoles);
// router.get('/statistics/login-intensity', userController.getLoginIntensity);

exports = module.exports = router;