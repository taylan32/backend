const express = require("express");
const product = require("./productRoute");
const category = require("./categoryRoute");
const file = require("./fileRoute");
const auth = require("./authRoute");
const user = require("./userRoute");
const order = require("./orderRoute");
const cart = require("./cartRoute");
const city = require("./cityRoute");

const router = express.Router();

router.use("/products", product);
router.use("/categories", category);
router.use("/files", file);
router.use("/auth", auth);
router.use("/users", user);
router.use("/orders", order);
router.use("/carts", cart);
router.use("/cities", city);

module.exports = router;
