const cloudinary = require("cloudinary").v2;
cloudinary.config({
  //   CLOUD_NAME=dshyra0lz
  // API_KEY=377311947974679
  // API_SECRET=Xg6rwfXQnWhVA2lBqDxTZoeDO_I
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
  // cloud_name: "dshyra0lz",
  // api_key: "377311947974679",
  // api_secret: "Xg6rwfXQnWhVA2lBqDxTZoeDO_I",
  secure: true,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return await cloudinary.uploader.upload(fileToUploads, {
    folder: "product",
  });
};

module.exports = { cloudinaryUploadImg };
