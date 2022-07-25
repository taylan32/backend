const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const getUserById = asyncHandler(async (req, res, next) => {
  await User.findById({ _id: req.query.id }).then((user) => {
    if (user == null) {
      next(new CustomError.CustomError("User not found", 404));
    } else {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: user,
      });
    }
  });
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  await User.find({}).then((users) => {
    res.status(200).json({
      success: true,
      message: "Listed",
      data: users,
    });
  });
});

const getAllUsersWithPage = asyncHandler(async (req, res, next) => {
  const page = req.query.page;
  const itemPerPage = req.query.itemPerPage;
  const totalUser = await User.find().countDocuments();
  await User.find({})
    .sort("createdAt")
    .skip((page - 1) * itemPerPage)
    .limit(itemPerPage)
    .then((user) => {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: {
          users: user,
          currentPage: page,
          totalPage: Math.ceil(totalUser / itemPerPage),
          itemPerPage:itemPerPage,
          totalUser:totalUser
        },
      });
    });
});

module.exports = {
  getUserById,
  getAllUsers,
  getAllUsersWithPage,
};
