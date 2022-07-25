const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const getAll = asyncHandler(async (req, res, next) => {
  await Product.find({})
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path:"user",
      select:"email firstName lastName"
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: result,
      });
    });
});

const add = asyncHandler(async (req, res, next) => {
  const information = req.body;
  await Product.create({
    ...information,
    images: ["default.jpg"],
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Added",
    });
  });
});

const update = asyncHandler(async (req, res, next) => {
  const { name, price, description, unitsInStock } = req.body;
  //   let productToUpdate = Product.findById({ _id: req.body.id });
  //   productToUpdate.name = name,
  //   productToUpdate.price = price,
  //   productToUpdate.description = description,
  //   productToUpdate.unitsInStock = unitsInStock

  //   await productToUpdate.save()

  await Product.findByIdAndUpdate(req.body.id, {
    name,
    price,
    description,
    unitsInStock,
    category,
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Updated",
    });
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  await Product.findByIdAndRemove(req.body.id).then(() => {
    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  });
});

const getById = asyncHandler(async (req, res, next) => {
  await Product.findById({ _id: req.query.id })
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path:"user",
      select:"email firstName lastName"
    })
    .then((result) => {
      if (result == null) {
        next(new CustomError.CustomError("Product not found", 404));
      } else {
        res.status(200).json({
          success: true,
          message: "Listed",
          data: result,
        });
      }
    });
});

const getAllWithPage = asyncHandler(async (req, res, next) => {
  const page = req.query.page;
  const itemPerPage = req.query.itemPerPage;
  const totalProduct = await Product.find().countDocuments();
  const products = await Product.find({})
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path:"user",
      select:"email firstName lastName"
    })
    .sort("createdAt")
    .skip((page - 1) * itemPerPage)
    .limit(itemPerPage);
  res.status(200).json({
    success: true,
    message: "Listed",
    data: {
      products: products,
      currentPage: page,
      totalPage: Math.ceil(totalProduct / itemPerPage),
      itemPerPage: itemPerPage,
      totalProdcut: totalProduct,
    },
  });
});

const getProductsByCategoryIdWithPage = asyncHandler(async (req, res, next) => {
  const page = req.query.page;
  const itemPerPage = req.query.itemPerPage;
  const totalProduct = await Product.find({
    category: req.query.categoryId,
  }).countDocuments();
  await Product.find({ category: req.query.categoryId })
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path:"user",
      select:"email firstName lastName"
    })
    .sort("createdAt")
    .skip((page - 1) * itemPerPage)
    .limit(itemPerPage)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: {
          products: result,
          currentPage: page,
          totalPage: Math.ceil(totalProduct / itemPerPage),
          itemPerPage: itemPerPage,
          totalProduct: totalProduct,
        },
      });
    });
});

const getProductsByCategoryId = asyncHandler(async (req, res, next) => {
  await Product.find({ category: req.query.categoryId })
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path:"user",
      select:"email firstName lastName"
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: result,
      });
    });
});

const getProductsByUserId = asyncHandler(async (req, res, next) => {
  await Product.find({ user: req.query.id })
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path:"user",
      select:"email firstName lastName"
    })
    .then((products) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: products,
      });
    });
});

const getRecentProducts = asyncHandler(async (req, res, next) => {
  await Product.find({})
    .sort({ createdAt: -1 })
    .limit(req.query.amount)
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path:"user",
      select:"email firstName lastName"
    })
    .then((products) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: products,
      });
    });
});

module.exports = {
  getAll,
  add,
  update,
  deleteProduct,
  getById,
  getAllWithPage,
  getProductsByCategoryIdWithPage,
  getProductsByCategoryId,
  getProductsByUserId,
  getRecentProducts,
};
