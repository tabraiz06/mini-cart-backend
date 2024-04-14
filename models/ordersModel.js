const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    products: {
      type: Array,
    },

    totalPrice: {
      type: Number,
      require: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    userAddress: { type: Array },

    date: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);
const model = mongoose.model("order", orderSchema);
module.exports = model;
