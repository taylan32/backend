const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verification = require("../middlewares/authorization/auth");
router.get(
    "/getById", 
    [verification.checkIfAdmin], 
    userController.getUserById
);
router.get(
    "/getAll", 
    [verification.checkIfAdmin], 
    userController.getAllUsers
);
router.get(
  "/getAllWithPage",
  [verification.checkIfAdmin],
  userController.getAllUsersWithPage
);

module.exports = router;
