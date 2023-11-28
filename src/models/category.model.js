const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
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

const Category = model("Category", categorySchema);
module.exports = Category;
