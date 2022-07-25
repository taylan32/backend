const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");

const addToCart = asyncHandler(async (req, res, next) => {
  const informations = req.body;
  await Cart.create({
    ...informations,
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Added",
    });
  });
});

const getCart = asyncHandler(async (req, res, next) => {
  await Cart.find({ user: req.query.userId })
    .populate({
      path: "products.productId",
      select: "name price category images",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate({
      path: "user",
      select: "email firstName lastName",
    })
    .then((cart) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: cart,
      });
    });
});

const updateCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.find({ user: req.body.userId });
  cart[0].products = req.body.products;
  await cart[0].save();
  res.status(200).json({
    success: true,
    message: "Updated",
  });
});

const clearCart = asyncHandler(async (req, res, next) => {
  const carts = await Cart.find({ user: req.body.userId });
  const cartId = carts[0]._id;
  await Cart.findByIdAndRemove(cartId).then(() => {
    res.status(200).json({
      success: true,
      message: "Removed",
    });
  });
});

module.exports = {
  addToCart,
  getCart,
  updateCart,
  clearCart,
};
