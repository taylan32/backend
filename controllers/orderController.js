const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const CustomError = require("../helpers/error/CustomError");
const mongoose = require("mongoose");
const { populate } = require("../models/Order");

const add = asyncHandler(async (req, res, next) => {
  const informations = req.body;
  await Order.create({
    ...informations,
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Order added",
    });
  });
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  // await Order.aggregate([
  //   {
  //     $lookup: {
  //       from: "products",
  //       let: { categoryId: "$categoryId" },
  //       pipeline: [
  //         {
  //           $match: { $expr: { $eq: ["$$categoryId", "$categoryId"] } },
  //         },
  //         {
  //           $lookup: {
  //             from: "categories",
  //             localField: "category",
  //             foreignField: "_id",
  //             as: "category",
  //           },
  //         },
  //       ],
  //       localField: "product",
  //       foreignField: "_id",
  //       as: "product",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "user",
  //       foreignField: "_id",
  //       as: "user",
  //     },
  //   },
  // ]).then((orders) => {
  //   res.status(200).json({
  //     success: true,
  //     message: "Listed",
  //     data: orders,
  //   });
  // });

  await Order.find({})
    .populate({
      path: "product",
      select: "name price category",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate({
      path: "user",
      select: "email firstName lastName profileImage",
    })
    .then((orders) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: orders,
      });
    });
});

const getById = asyncHandler(async (req, res, next) => {
  //   await Order.aggregate([
  //     { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
  //     {
  //       $lookup: {
  //         from: "products",
  //         let: { categoryId: "$categoryId" },
  //         pipeline: [
  //           {
  //             $match: { $expr: { $eq: ["$$categoryId", "$categoryId"] } },
  //           },
  //           {
  //             $lookup: {
  //               from: "categories",
  //               localField: "category",
  //               foreignField: "_id",
  //               as: "category",
  //             },
  //           },
  //         ],
  //         localField: "product",
  //         foreignField: "_id",
  //         as: "product",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "user",
  //         foreignField: "_id",
  //         as: "user",
  //       },
  //     },
  //   ]).then((order) => {
  //     if (order.length == 0) {
  //       next(new CustomError.CustomError("Order not found"), 404);
  //     } else {
  //       res.status(200).json({
  //         success: true,
  //         message: "Listed",
  //         data: order,
  //       });
  //     }
  //   });

  await Order.findById({ _id: req.query.id })
    .populate({
      path: "product",
      select: "name price category",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate({
      path: "user",
      select: "email firstName lastName profileImage",
    })
    .then((order) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: order,
      });
    });
});
const deleteOrder = asyncHandler(async (req, res, next) => {
  await Order.findByIdAndRemove(req.body.id).then(() => {
    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  });
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const { product, user, amount } = req.body;
  await Order.findByIdAndUpdate(req.body.id, {
    product,
    user,
    amount,
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Updated",
    });
  });
});

const getOrdersByUserId = asyncHandler(async (req, res, next) => {
  await Order.find({ user: req.query.ownerId })
    .populate({
      path: "product",
      select: "name price category",
      populate: {
        path: "category",
        select:"name"
      },
    })
    .populate({
      path: "user",
      select: "email firstName lastName",
    })
    .then((orders) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: orders,
      });
    });
});


module.exports = {
  add,
  getAllOrders,
  getById,
  deleteOrder,
  updateOrder,
  getOrdersByUserId,
};
