const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller.js');
const auth = require('../middleware/auth.middleware');




router.get('/', deviceController.GetDevice);
router.get('/:id',  deviceController.GetDeviceById);
router.post('/', deviceController.CreateDevice);
router.put('/:id',  deviceController.UpdateDevice);
router.delete('/:id', deviceController.DeleteDevice);
//router.patch('/schedule/:id', deviceController.autoUpdateSchedule);

exports = module.exports = router;