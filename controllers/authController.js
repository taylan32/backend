const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwtHelper = require("../helpers/jwt/jwtHelper");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/validator/validate");
const CustomError = require("../helpers/error/CustomError");

const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  // await User.create({
  //     email:email,
  //     password:password,
  //     firstName:firstName,
  //     lastName:lastName
  // }).then((user) => {
  //     jwtHelper.getJWTFromUser(user, res)
  // })
  await User.create({
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    isAdmin:req.body.isAdmin
  }).then(() => {
    res.status(200).json({
      success: true,
      message: "registered",
    });
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password)) {
    return next(new CustomError.CustomError("Invalid input", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!comparePassword(password, user.password)) {
    return next(new CustomError.CustomError("Email or password is wrong"));
  }

  jwtHelper.getJWTFromUser(user, res);
});

module.exports = {
  register,
  login,
};
