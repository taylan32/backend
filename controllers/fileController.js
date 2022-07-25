const uploadFile = require("../middlewares/file/upload");
const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const fs = require("fs");
const Product = require("../models/Product");

// const upload = asyncHandler(async (req, res, next) => {
//   try {
//     await uploadFile(req, res);
//     if (req.file != null) {
//       res.status(200).json({
//         success: true,
//         message: "File uploaded",
//       });
//     } else {
//       next(new CustomError.CustomError("Please upload a file", 400));
//     }
//   } catch (error) {
//     if (error.code == "LIMIT_FILE_SIZE") {
//       next(
//         new CustomError.CustomError("File size cannot be larger than 2 MB."),
//         400
//       );
//     }
//     res.status(500).json({
//       success: false,
//       message: `Internal Server Error. File could not uploaded: ${req.file.originalname}. Error Message: ${error}`,
//     });
//   }
// });

// const upload = asyncHandler(async (req, res, next) => {
//   try {
//     await uploadFile(req, res);
//     if (req.files.length > 0) {
//         res.status(200).json({
//             success: true,
//             message: "File has been uploaded",
//         });
//     } else {
//       next(new CustomError.CustomError("Please upload a file", 400));
//     }
//   } catch (error) {
//     if (error.code === "LIMIT_FILE_SIZE") {
//       next(
//         new CustomError.CustomError(
//           "You cannot upload a file larger than 10 MB."
//         ),
//         400
//       );
//     }
//     else if (error.code === "LIMIT_UNEXPECTED_FILE") {
//       next(new CustomError.CustomError("Too many files to upload. You can upload up to 10 files at a time.", 400));
//     }
//     else {
//         res.status(422).json({
//           success: false,
//           message: `File could not uploaded: ${error}`,
//         });
//     }
//   }
// });

const upload = asyncHandler(async (req, res, next) => {
  try {
    await uploadFile(req, res).then(async () => {
      if (req.files.length > 0) {
        let imageUrls = [];
        for (let item in req.files) {
          imageUrls.push(req.files[item].filename);
        }
        await Product.findById({ _id: req.body.id }).then((result) => {
          // const tempArray = result.images.concat(imageUrls).shift();
          // result.images = tempArray;
          if (result.images[0] === "default.jpg") {
            // product has only default image
            result.images.pop();
          }
          result.images = result.images.concat(imageUrls);
          result.save();
          res.status(200).json({
            success: true,
            message: "File has been uploaded",
          });
        });
      } else {
        next(new CustomError.CustomError("Please upload a file", 400));
      }
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      next(
        new CustomError.CustomError(
          "You cannot upload a file larger than 10 MB."
        ),
        400
      );
    } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
      next(
        new CustomError.CustomError(
          "Too many files to upload. You can upload up to 10 files at a time.",
          400
        )
      );
    } else {
      res.status(422).json({
        success: false,
        message: `File could not uploaded: ${error}`,
      });
    }
  }
});

// const getFiles = asyncHandler(async (req, res, next) => {
//   const directory = __basedir + "/public/assets/uploads/";
//   fs.readdir(directory, function (error, files) {
//     if (error) {
//       res.status(500).json({
//         success: false,
//         message: "Unable to scan files",
//       });
//     }
//     let fileInfos = [];
//     files.map((file) => {
//       fileInfos.push({
//         name: file,
//         url: directory + file,
//       });
//     });
//     res.status(200).json({
//       success: true,
//       message: "Listed",
//       data: fileInfos,
//     });
//   });
// });

const getFiles = asyncHandler(async (req, res, next) => {
  await Product.findById({ _id: req.body.id }).then((result) => {
    if (result == null) {
      next(new CustomError.CustomError("Product not found", 404));
    } else {
      res.status(200).json({
        success: true,
        message: "Listed",
        data: result.images,
      });
    }
  })
});

const download = asyncHandler(async (req, res, next) => {
  const fileName = req.params.name;
  const directory = __basedir + "/public/assets/uploads/";
  res.download(directory + fileName, fileName, (error) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Could not download the file: " + error,
      });
    }
  });
});

const removeFile = asyncHandler(async (req, res, next) => {
  const fileName = req.body.name;
  const filePath = __basedir + "/public/assets/uploads/" + fileName;
  await Product.findById({ _id: req.body.id }).then((product) => {
    let images = product.images;
    const index = images.indexOf(req.body.name);
    if (index != -1) {
      images.splice(index, 1);
      product.images = images
      product.save()
      fs.unlinkSync(filePath);
      res.status(200).json({
        success: true,
        message: "File removed",
      });
    } else {
      next(new CustomError.CustomError("Image not found", 404));
    }
  });
});

module.exports = {
  upload,
  getFiles,
  download,
  removeFile,
};
