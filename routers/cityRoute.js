const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const verification = require("../middlewares/authorization/auth");

router.get("/getAll", cityController.getAll);
router.get("/getById", cityController.getById);

router.post(
  "/add",
  [verification.checkIfSignedIn, verification.checkIfAdmin],
  cityController.add
);
router.post(
  "/delete",
  [verification.checkIfSignedIn, verification.checkIfAdmin],
  cityController.deleteCity
);
router.post(
  "/update",
  [verification.checkIfSignedIn, verification.checkIfAdmin],
  cityController.update
);

module.exports = router;
