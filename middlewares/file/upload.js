const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __basedir + "/public/assets/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// let uploadFile = multer({
//   storage: storage,
//   limits: { fileSize: maxSize },
// }).single("file");

// let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __basedir + "/public/assets/uploads/");
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg", "image/jpg"];
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only .png, .jpeg, .jpg allowed`; 
      callback(message, null);
    }
    var date = new Date();
    var d = String(date.getDate()).padStart(2, "0");
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var y = date.getFullYear();
    date = m + "-" + d + "-" + y;
    var filename = `img_${date}_${file.originalname}`;
    callback(null, filename);
  },
});

var uploadFiles = multer({
  storage: storage,
  limits: maxSize,
}).array("multi-files", 10);

var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
