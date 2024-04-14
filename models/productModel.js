const mongoose = require("mongoose");
const productModel = mongoose.Schema({
  p_catagery: {
    type: String,
    require: true,
  },
  p_name: {
    type: String,
    require: true,
  },
  p_discription: {
    type: String,
    require: true,
  },
  p_price: {
    type: Number,
    require: true,
  },
  p_image: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  sellerId: {},
});
const Product = mongoose.model("product", productModel);
module.exports = Product;
