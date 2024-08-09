const nodemailer = require("nodemailer");
const Order = require("../models/Order");
const Product = require("../models/Product");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.postOrder = async (req, res) => {
  const {
    userId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    products,
    totalPrice,
  } = req.body;
  try {
    for (const item of products) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }
      if (product.count < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // Deduct stock for each product
    for (const item of products) {
      const product = await Product.findById(item._id);
      product.count -= item.quantity;
      await product.save();
    }
    const newOrder = new Order({
      user: userId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      products,
      totalPrice,
    });
    const savedOrder = await newOrder.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: "Order Confirmation",
      html: `
        <h1>Xin Chào ${customerName}</h1>
        <p>Phone: ${customerPhone}</p>
        <p>Address: ${customerAddress}</p>
        <table>
          <thead>
            <tr>
              <th>Tên Sản Phẩm</th>
              <th>Hình Ảnh</th>
              <th>Giá</th>
              <th>Số Lượng</th>
              <th>Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr style="text-align: center">
                <td>${product.name}</td>
                <td><img src="${product.img1}" alt="${
                  product.name
                }" width="50"/></td>
                <td>${product.price.toLocaleString()} VND</td>
                <td>${product.quantity}</td>
                <td>${(
                  product.price * product.quantity
                ).toLocaleString()} VND</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <h2>Tổng Thanh Toán: ${totalPrice.toLocaleString()} VND</h2>
        <p>Cảm ơn bạn!</p>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).send("Error creating order");
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).send("Error retrieving orders");
  }
};
