const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ orderId: req.params.orderId })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      orderId: req.params.orderId,
      senderId: req.user._id,
      content: req.body.content,
    });
    const populated = await message.populate('senderId', 'name role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
