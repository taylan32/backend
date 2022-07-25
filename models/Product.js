const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: [2, "Product name must have at contain 2 characters"],
      unique: [true, "Product has already been added."],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      minimum: [0, "Price cannot be less than 0."],
    },
    description: {
      type: String,
      required: [true, "Please provice a description"],
      minlength: [10, "Description must have at least 10 letters."],
    },
    unitsInStock: {
      type: Number,
      required: [true, "Please provide stock amount"],
      minimum: [0, "Stock amount cannot be less than 0."],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Category missing"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Seller missing"],
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
