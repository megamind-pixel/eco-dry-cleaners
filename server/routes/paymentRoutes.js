const express = require('express');
const { stkPush, callback } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/mpesa/stkpush', protect, stkPush);
router.post('/mpesa/callback', callback);

module.exports = router;
