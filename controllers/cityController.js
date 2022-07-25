const asyncHandler = require("express-async-handler");
const City = require("../models/City");
const CustomError = require("../helpers/error/CustomError");

const add = asyncHandler(async (req, res, next) => {
  const informations = req.body;
  await City.create({
    ...informations,
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "Added",
    });
  });
});

const getAll = asyncHandler(async (req, res, next) => {
  await City.find({}).then((cities) => {
    res.status(200).json({
      success: true,
      message: "Listed",
      data: cities,
    });
  });
});

const update = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  await City.findByIdAndUpdate(req.body.id, { name }).then(() => {
    res.status(200).json({
      success: true,
      message: "Updated",
    });
  });
});

const deleteCity = asyncHandler(async (req, res, next) => {
  await City.findByIdAndRemove(req.body.id).then(() => {
    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  });
});

const getById = asyncHandler(async (req, res, next) => {
  await City.findById({ _id: req.query.id }).then((city) => {
    if (city == null) {
      next(new CustomError.CustomError("City not found", 404));
    } else {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: city,
      });
    }
  });
});

module.exports = {
  add,
  getAll,
  update,
  deleteCity,
  getById,
};
