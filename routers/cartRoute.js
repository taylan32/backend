const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.post("/update", cartController.updateCart);
router.post("/clear", cartController.clearCart);

router.get("/getCart", cartController.getCart);

module.exports = router;
