const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verification = require("../middlewares/authorization/auth");

router.get("/getAll", productController.getAll);
router.get(
  "/getById",
  productController.getById
);
router.get(
  "/getAllWithPage",
  productController.getAllWithPage
);
router.get(
  "/getProductsByCategoryIdWithPage",
  productController.getProductsByCategoryIdWithPage
);
router.get(
  "/getProductsByCategoryId",
  productController.getProductsByCategoryId
);

router.get(
  "/getRecentProducts",
  productController.getRecentProducts
)
router.get("/getProductsByUserId",[verification.checkIfSignedIn], productController.getProductsByUserId);
router.post("/add", [verification.checkIfSignedIn], productController.add);

router.post(
  "/update",
  [verification.checkIfSignedIn, verification.checkIfProductOwner],
  productController.update
);
router.post(
  "/delete",
  [verification.checkIfSignedIn, verification.checkIfProductOwner],
  productController.deleteProduct
);

module.exports = router;
