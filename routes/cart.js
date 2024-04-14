const express = require("express");
const Cart = require("../models/cartModel");
const verifyToken = require("../middleware/verifyToken");
const { route } = require("./products");
const router = express.Router();

// add to cart by user
router.post("/cart", verifyToken, async (req, res) => {
  const { productId, product_name, quantity, finalPrice } = req.body;
  try {
    const addCart = await Cart.create({
      userId: req.user,
      productId,

      quantity,
      finalPrice,
    });
    res.status(200).json({ message: "successfully added to the cart" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// get all cart products by user
router.get("/getcart", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user }).populate("productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// remove product form cart by user
router.delete("/cart/:id", verifyToken, async (req, res) => {
  try {
    const removeProduct = await Cart.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "product removed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//remove all product from cart
router.delete("/delete/all", verifyToken, async (req, res) => {
  try {
    const allDelete = await Cart.findAndDelete({ userId: req.user });
    res.status(200).json({ message: "cart products removed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// update the quantity by user
router.patch("/cart/:id", verifyToken, async (req, res) => {
  const { quantity, finalPrice } = req.body;
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      { _id: req.params.id },
      { quantity, finalPrice }
    );
    res.status(200).json({ message: "cart has been updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
