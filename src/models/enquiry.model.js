const { Schema, model, default: mongoose } = require("mongoose");
const enquirychema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    unique: true,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Submmited",
    enum: ["Submmited", "Contacted", "In Progress"],
  },
});

const Enqiry = model("Enqiry", enquirychema);
module.exports = Enqiry;
