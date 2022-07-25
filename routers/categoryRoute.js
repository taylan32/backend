const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();
const verification = require("../middlewares/authorization/auth");

router.get("/getAll", categoryController.getAll);
router.get("/getById", categoryController.getById);
router.get("/getFirstEightCategories", categoryController.getFirstEightCategories)

router.post(
  "/add",
  [verification.checkIfSignedIn, verification.checkIfAdmin],
  categoryController.add
);
router.post(
  "/delete",
  [verification.checkIfSignedIn, verification.checkIfAdmin],
  categoryController.deleteCategory
);
router.post(
  "/update",
  [verification.checkIfSignedIn, verification.checkIfAdmin],
  categoryController.update
);

module.exports = router;
