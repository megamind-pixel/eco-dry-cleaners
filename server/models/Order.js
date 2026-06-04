const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  serviceType: { type: String, required: true },
  package: { type: String, required: true },
  pickupDate: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  quantity: { type: Number, required: true },
  coupon: { type: String },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 150 },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'Order Received' },
  statusIndex: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'Pending' },
  paymentMethod: { type: String, default: 'mpesa' },
  checkoutRequestId: { type: String },
  images: [{ type: String }], // Array of image URLs/paths
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  driverLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
