const express = require('express');
const router = express.Router();


const sauceCtrl = require('../controllers/sauceControllers');
const multer = require('../middleware/multerConfig');
const auth = require('../middleware/auth');
const controlData = require('../middleware/valideInput');

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, controlData.sauceData, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, controlData.sauceData, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;

