const express = require("express");
const Order = require("../models/ordersModel");
const verifyToken = require("../middleware/verifyToken");
const { route } = require("./user");
const router = express.Router();
// get orders by normal users
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// get all past orders
router.get("/all/orders", async (req, res) => {
  try {
    const allPastOrdes = await Order.find().populate("userId", "-password");
    res.status(200).json(allPastOrdes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// create an order by normal users
router.post("/create/order", verifyToken, async (req, res) => {
  const { products, totalPrice, userAddress } = req.body;
  //   console.log(req.)
  try {
    const order = await Order.create({
      products,

      totalPrice,
      userAddress,

      userId: req.user,
    });
    res.status(200).json({ message: "your order is successfull" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// fetch orders by seller
router.get("/seller/:id", verifyToken, async (req, res) => {
  //   console.log(req.params.id);
  try {
    const orders = await Order.find({ sellerId: req.params.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// update the order status by seller
router.patch("/update/:orderId", verifyToken, async (req, res) => {
  const { orderStatus } = req.body;
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      { _id: req.params.orderId },
      { orderStatus }
    );
    res.status(200).json({ message: "order updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
