const { Schema, model } = require("mongoose");

const blogcategorySchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("BlogCategory", blogcategorySchema);
module.exports = Category;
