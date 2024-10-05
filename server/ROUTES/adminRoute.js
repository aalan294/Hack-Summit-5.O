const express = require('express');
const router = express.Router();

//verify hospital
//verify pharmacy
router.route('/get-doc')
    .get(require('../CONTROLLERS/adminController').getDoctors)
router.route('/get-pharm')
    .get(require('../CONTROLLERS/adminController').getPharamacies)

module.exports = router;