const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const verifyToken = require("../middleware/verifyToken");
// for normal users
router.get("/products", async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// seller products
router.get("/products/seller", verifyToken, async (req, res) => {
  try {
    const product = await Product.find({ userId: req.user });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// add products by seller
router.post("/add", verifyToken, async (req, res) => {
  const { p_catagery, p_name, p_discription, p_image, p_price, sellerId } =
    req.body;
  try {
    const product = Product.create({
      p_catagery,
      p_name,
      p_discription,
      p_image,
      p_price,
      userId: req.user,
      sellerId,
    });
    res.status(200).json({ message: "product added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// filter the product list
router.get("/products/search", async (req, res) => {
  const { p_name, p_catagery } = req.query;
  console.log(req.query);
  try {
    const product = p_name
      ? await Product.find({ p_name })
      : await Product.find({ p_catagery });
    //  const product = await Product.find({ p_name }):

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });

    //  const product = await Product.find({ p_name }):

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//update the products by seller
router.put("/products/:id", async (req, res) => {
  const { p_catagery, p_name, p_discription, p_image, p_price } = req.body;
  console.log(req.body);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { p_catagery, p_name, p_discription, p_image, p_price }
    );
    res.status(200).json({ message: "product updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//delete product by seller
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
