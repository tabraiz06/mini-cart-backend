const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
  },

  quantity: {
    type: Number,
    require: true,
  },
  finalPrice: {
    type: Number,
    require: true,
  },
});
const model = mongoose.model("cart", cartSchema);
module.exports = model;
