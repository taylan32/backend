const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verification = require("../middlewares/authorization/auth");

router.post("/add", [verification.checkIfSignedIn], orderController.add);

router.post(
  "/delete",
  [
    verification.checkIfSignedIn,
    verification.checkIfUserHavePermissionForOrders,
  ],
  orderController.deleteOrder
);
router.post(
  "/update",
  [
    verification.checkIfSignedIn,
    verification.checkIfUserHavePermissionForOrders,
  ],
  orderController.updateOrder
);

router.get(
  "/getAll",
  [
    verification.checkIfSignedIn,
    verification.checkIfUserHavePermissionForOrders,
  ],
  orderController.getAllOrders
);
router.get(
  "/getById",
  [
    verification.checkIfSignedIn,
    verification.checkIfUserHavePermissionForOrders,
  ],
  orderController.getById
);

router.get(
  "/getOrdersByUserId",
  [
    verification.checkIfSignedIn,
    verification.checkIfUserHavePermissionForOrders,
  ],
  orderController.getOrdersByUserId
);

module.exports = router;
