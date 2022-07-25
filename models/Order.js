const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Product missing"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User missing"],
    },
    amount: {
      type: Number,
      required: [true, "Please provide amount"],
      min: [1, "Invalid input. Amount must be greater than 0."],
    },
    city: {
      type: mongoose.Types.ObjectId,
      ref: "City",
      required: [true, "City missing"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
