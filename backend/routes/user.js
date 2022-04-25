const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const controlData = require('../middleware/valideInput');

router.post('/signup', controlData.userData, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;