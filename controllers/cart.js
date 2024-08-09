const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      res.json(cart.items);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postCart = async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items },
      { new: true, upsert: true }
    );
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.updateOne({ userId }, { $set: { items: [] } });
    res.status(200).send({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error clearing cart" });
  }
};

