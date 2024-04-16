const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
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
// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the 'uploads' directory if it doesn't exist
    const dir = "./uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/image", upload.single("image"), async (req, res) => {});

router.post("/add", verifyToken, upload.single("p_image"), async (req, res) => {
  const { p_catagery, p_name, p_discription, p_price, sellerId } = req.body;
  const imagePath = req.file.filename;

  try {
    const product = await Product.create({
      p_catagery: req.body.p_catagery,
      p_name: req.body.p_name,
      p_discription: req.body.p_discription,
      p_image: imagePath,
      p_price: req.body.p_price,
      userId: req.user,
      sellerId: req.body.sellerId,
    });
    res.status(200).json({ message: "product added successfully", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// filter the product list
router.get("/products/search", async (req, res) => {
  const { p_name, p_catagery } = req.query;

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
// view single product
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
