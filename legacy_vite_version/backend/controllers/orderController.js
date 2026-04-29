const Order = require('../models/Order');
const OrderUpdate = require('../models/OrderUpdate');

exports.createOrder = async (req, res) => {
  try {
    const { type, title, description, instructions, deadline, price } = req.body;
    const order = await Order.create({
      userId: req.user._id,
      type,
      title,
      description,
      instructions,
      deadline,
      price,
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    if (req.body.price) order.price = req.body.price;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addOrderUpdate = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const update = await OrderUpdate.create({
      orderId: order._id,
      message: req.body.message,
    });
    res.status(201).json(update);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrderUpdates = async (req, res) => {
  try {
    const updates = await OrderUpdate.find({ orderId: req.params.id }).sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
