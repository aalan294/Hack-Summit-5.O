const express = require('express');
const router = express.Router();

//verify hospital
router.route('/verify-hospital/:id')
    .patch(require('../CONTROLLERS/adminController').verifyHospital)
//verify pharmacy
router.route('/verify-pharm')
    .patch(require('../CONTROLLERS/adminController').verifypharm)
router.route('/get-doc')
    .get(require('../CONTROLLERS/adminController').getDoctors)
router.route('/get-pharm')
    .get(require('../CONTROLLERS/adminController').getPharamacies)

module.exports = router;