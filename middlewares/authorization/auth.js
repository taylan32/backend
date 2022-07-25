const customError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const tokenHelper = require("../../helpers/jwt/jwtHelper");
const asyncHandler = require("express-async-handler");
const Product = require("../../models/Product");

const config = require("dotenv");
const User = require("../../models/User");
const Order = require("../../models/Order");

const checkIfSignedIn = async (req, res, next) => {
  const { SECRET_KEY } = process.env;
  if (!tokenHelper.checkIfTokenIncluded(req)) {
    return next(new customError.CustomError("You must login", 403));
  }
  const token = tokenHelper.getJWTFromHeader(req);
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      return next(
        new customError.CustomError(
          "Your session has expired. Please sign in again",
          401
        )
      );
    }
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  });
};

const checkIfProductOwner = asyncHandler(async (req, res, next) => {
  const productId = req.body.id;
  await Product.findById(productId)
    .populate({
      path: "user",
      select: "email",
    })
    .then((product) => {
      if (product.user.email != req.headers.email) {
        return next(new customError.CustomError("Authorization denied.", 401));
      }

      next();
    });
});

const checkIfOrderOwner = asyncHandler(async (req, res, next) => {
  // await Order.find({ user: req.query.ownerId })
  //   .populate({
  //     path: "user",
  //     select: "email",
  //   })
  //   .then((orders) => {
  //     if (orders == null) {
  //       return next(new customError.CustomError("Order not found", 404));
  //     } else {
  //       orders.map((order) => {
  //         if (order.user.email != req.headers.email) {
  //           return next(
  //             new customError.CustomError("Authorization denied", 401)
  //           );
  //         }
  //       });
  //       next();
  //     }
  //   });
  await Order.findOne({ user: req.query.ownerId })
    .populate({
      path: "user",
      select: "email",
    })
    .then((order) => {
      if (order == null) {
        return next(new customError.CustomError("Order not found", 404));
      } else {
        if (order.user.email != req.headers.email) {
          return next(new customError.CustomError("Authorization denied", 401));
        }
        next();
      }
    });
});

const checkIfUserHavePermissionForOrders = asyncHandler(
  async (req, res, next) => {
    await Order.find(req.query.id)
      .populate({ path: "user", select: "email isAdmin" })
      .then(async (orders) => {
        if (orders == null) {
          return next(new customError.CustomError("Order not found", 404));
        } else {
          if (orders[0].user.email != req.headers.email) {
            await User.findOne({ email: req.headers.email }).then((user) => {
              if (user == null || user.isAdmin == false) {
                return next(
                  new customError.CustomError("Authorization denided", 401)
                );
              }
            });
          }
          next();
        }
      });
  }
);

const checkIfAdmin = asyncHandler(async (req, res, next) => {
  await User.findOne({ email: req.headers.email }).then((user) => {
    if (user == null) {
      return next(new customError.CustomError("Authorization denied", 401));
    } else {
      if (user.isAdmin === false) {
        return next(
          new customError.CustomError(
            "This operation can be performed by admin.",
            403
          )
        );
      }
      next();
    }
  });
});

module.exports = {
  checkIfSignedIn,
  checkIfProductOwner,
  checkIfAdmin,
  checkIfOrderOwner,
  checkIfUserHavePermissionForOrders,
};
