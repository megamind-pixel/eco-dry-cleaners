const Order = require('../models/Order');
const Notification = require('../models/Notification');

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = 'ECO' + Date.now().toString().slice(-6);
    
    // Handle images if any (uploaded via multer)
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const order = new Order({
      ...orderData,
      orderId,
      userId: req.userId,
      images
    });

    await order.save();

    const notification = new Notification({
      userId: req.userId,
      message: `New order ${orderId} placed successfully!`,
      type: 'success'
    });
    await notification.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, statusIndex } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status, statusIndex },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const notification = new Notification({
      userId: order.userId,
      message: `Order ${order.orderId} status updated to ${status}`,
      type: 'info'
    });
    await notification.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { paymentStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, updatePaymentStatus };
