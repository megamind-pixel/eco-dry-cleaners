const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getOrders, getOrderById, updateOrderStatus, updatePaymentStatus } = require('../controllers/orderController');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', protect, upload.array('images', 5), createOrder);
router.get('/', protect, getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
