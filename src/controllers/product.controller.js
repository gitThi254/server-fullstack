const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const slugify = require("slugify");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const ApiFeatures = require("../Utils/ApiFeatures");
const CustomError = require("../Utils/CustomError");

exports.createProduct = asyncErrorHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  res.json({
    data: newProduct,
  });
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!updateProduct)
    return next(
      new CustomError(`Product with id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: updateProduct,
  });
});

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const deleteProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deleteProduct)
    return next(
      new CustomError(`Product with id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: deleteProduct,
  });
});

exports.getProduct = asyncErrorHandler(async (req, res, next) => {
  const findProduct = await Product.findById(req.params.id);
  if (!findProduct)
    return next(
      new CustomError(`Product with id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: findProduct,
  });
});

exports.getallProduct = asyncErrorHandler(async (req, res, next) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .fields()
    .sort()
    .paginate();
  const products = await features.query;
  if (products.lenght === 0)
    return next(new CustomError("This Page does not exists", 404));
  res.json({
    data: products,
  });
});
exports.addToWishlist = asyncErrorHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  const user = await User.findById(_id);
  const alreadyadded = user.wishlist.find((id) => id.toString() === productId);
  if (alreadyadded) {
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishlist: productId },
      },
      {
        new: true,
      }
    );
    res.json(user);
  } else {
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $push: { wishlist: productId },
      },
      {
        new: true,
      }
    );
    res.json(user);
  }
});

exports.rating = asyncErrorHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, productId, comment } = req.body;
  const product = await Product.findById(productId);
  let alreadyRated = product.ratings.find(
    (userId) => userId.postedBy.toString() === _id.toString()
  );
  if (alreadyRated) {
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRated },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      {
        new: true,
      }
    );
  } else {
    await Product.findByIdAndUpdate(
      prodId,
      {
        $push: {
          ratings: {
            star: star,
            comment: comment,
            postedby: _id,
          },
        },
      },
      {
        new: true,
      }
    );
  }
  const getallratings = await Product.findById(productId);
  let totalRating = getallratings.ratings.length;
  let ratingsum = getallratings.ratings
    .map((item) => item.star)
    .reduce((prev, curr) => prev + curr, 0);
  let actualRating = (ratingsum / totalRating).toFixed(1);
  let finalproduct = await Product.findByIdAndUpdate(
    productId,
    {
      totalrating: actualRating,
    },
    { new: true }
  );
  res.json(finalproduct);
});
