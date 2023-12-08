const { default: mongoose, Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: [
      {
        public_id: String,
        url: String,
        asset_id: String,
      },
    ],
    color: [],
    tags: [],

    category: {
      type: String,
      required: true,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);
module.exports = Product;
