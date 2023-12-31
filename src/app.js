const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require("./controllers/err.controller");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const blogRoutes = require("./routes/blog.routes");
const categoryRoutes = require("./routes/category.routes");
const blogcategoryRoutes = require("./routes/blogcategory.routes");
const brandRoutes = require("./routes/brand.routes");
const colorRoutes = require("./routes/color.routes");
const enqRoutes = require("./routes/enq.routes");
const uploadRoutes = require("./routes/upload.routes");

const couponRoutes = require("./routes/coupon.routes");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/blogcategories", blogcategoryRoutes);
app.use("/api/v1/brand", brandRoutes);
app.use("/api/v1/color", colorRoutes);
app.use("/api/v1/enquiry", enqRoutes);

app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/upload", uploadRoutes);

app.use("*", (req, res, next) =>
  next(new CustomError(`Can't not find ${req.originalUrl} on the server`, 404))
);

app.use(globalErrorHandler);

module.exports = app;
