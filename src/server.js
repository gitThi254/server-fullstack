const { default: mongoose } = require("mongoose");
const app = require("./app");
require("dotenv").config();
const port = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then((con) => {
    console.log(`db connected`);
    app.listen(port, () => {
      console.log(`server running at : ${port}`);
    });
  })
  .catch((err) => {
    console.log(`db disconnected`);
  });
