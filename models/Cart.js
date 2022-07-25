const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: [true, "Product missing"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity cannot be empty"],
          default: 1,
        },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref:"User",
      required: [true, "User missing"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
