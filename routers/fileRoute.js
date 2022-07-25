const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const verification = require("../middlewares/authorization/auth");
router.post("/upload", fileController.upload);

router.get("/getFiles", fileController.getFiles);
router.get("/download/:name", fileController.download);
router.get(
  "/remove",
  [verification.checkIfSignedIn, verification.checkIfProductOwner],
  fileController.removeFile
);

module.exports = router;
