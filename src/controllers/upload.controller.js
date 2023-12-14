const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../Utils/cloudinary");
const fs = require("fs");
exports.uploadImages = asyncErrorHandler(async (req, res, next) => {
  let urls = [];
  const uploader = (path) => cloudinaryUploadImg(path);
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newpath = await uploader(path);
    urls.push(newpath);
    fs.unlinkSync(path);
  }
  const images = urls.map((file) => file);
  res.json(images);
});

exports.deleteImages = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  cloudinaryDeleteImg(id);
  res.json({
    data: id,
  });
});
