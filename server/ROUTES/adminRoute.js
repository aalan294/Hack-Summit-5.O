const express = require('express');
const router = express.Router();

router.route('/reg-doc')
    .post(require('../CONTROLLERS/adminController').registerDoctor)
router.route('/reg-pharm')
    .post(require('../CONTROLLERS/adminController').registerPharmacy);
router.route('/reg-recep')
    .post(require('../CONTROLLERS/adminController').registerReception)
router.route('/get-doc')
    .get(require('../CONTROLLERS/adminController').getDoctors)
router.route('/get-pharm')
    .get(require('../CONTROLLERS/adminController').getPharamacies)
router.route('/get-recep')
    .get(require('../CONTROLLERS/adminController').getReceptions)
module.exports = router;