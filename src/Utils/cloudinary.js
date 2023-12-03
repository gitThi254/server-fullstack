const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: "dshyra0lz",
  api_key: "377311947974679",
  api_secret: "Xg6rwfXQnWhVA2lBqDxTZoeDO_I",
  secure: true,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return await cloudinary.uploader.upload(fileToUploads).then((res) => {
    return {
      url: res.secure_url,
      asset_id: res.asset_id,
      public_id: res.public_id,
    };
  });
};

const cloudinaryDeleteImg = async (fileToUploads) => {
  return await cloudinary.uploader.destroy(fileToUploads).then((res) => {
    return {
      url: res.secure_url,
      asset_id: res.asset_id,
      public_id: res.public_id,
    };
  });
};
module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
