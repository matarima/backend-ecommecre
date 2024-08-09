
const Order = require('../models/Order');
const Session = require("../models/Session");


// Get stats
exports.getDashboardStats = async (req, res) => {
  try {
    const clients = await Order.distinct('user').countDocuments();
    const earnings = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const newOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    res.json({
      clients,
      earnings: earnings[0].total,
      newOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
}

// Get recent orders
exports.getRecentOrders =  async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).limit(10);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const sessions = await Session.find().select('_id user startTime endTime messages sessionId roomId');
    res.json(sessions);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

exports.getRoomId = async (req, res) => {
  try {
    const { roomId } = req.params.roomId;
    const session = await Session.findById(roomId).select('messages');
    res.json(session.messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

exports.postRoomId = async (req, res) => {
  try {
    const { roomId } = req.params.roomId;
    const { message, sessionId } = req.body;


    await Session.findByIdAndUpdate(
      roomId,
      { $push: { messages: message } },
      sessionId,
      { new: true }
    );

    res.status(201).send("Message added successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
}