const express = require('express');
const router = express.Router();


const sauceCtrl = require('../controllers/sauceControllers');
const multer = require('../middleware/multerConfig');

const auth = require('../middleware/auth');


router.get('/', sauceCtrl.getAllSauce);

router.post('/', multer, sauceCtrl.createSauce);

router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', multer, sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);
router.post('/:id/like', sauceCtrl.likeSauce);

module.exports = router;

