const express = require('express');
const router = express.Router();

router.route('/login')
    .post(require('../CONTROLLERS/pharmacyController').pharmLogin);

module.exports = router;