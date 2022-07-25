const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const add = asyncHandler(async (req, res, next) => {
  const information = req.body;
  await Category.create({
    ...information,
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Added",
    });
  });
});

const update = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  await Category.findByIdAndUpdate(req.body.id, {
    name,
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Updated",
    });
  });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndRemove(req.body.id).then(() => {
    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  });
});

const getAll = asyncHandler(async (req, res, next) => {
  await Category.find({}).then((result) => {
    res.status(200).json({
      success: true,
      message: "Listed",
      data: result,
    });
  });
});

const getFirstEightCategories = asyncHandler(async(req, res, next) => {
  await Category.find({})
  .sort()
  .limit(8)
  .then((categories) => {
    res.status(200).json({
      success: true,
      message: "Listed",
      data: categories,
    });
  })
})

const getById = asyncHandler(async (req, res, next) => {
  await Category.findById({ _id: req.query.id }).then((result) => {
    if (result == null) {
      next(new CustomError.CustomError("Category not found", 404));
    } else {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: result,
      });
    }
  });
});

module.exports = {
  add,
  update,
  deleteCategory,
  getAll,
  getById,
  getFirstEightCategories
};
