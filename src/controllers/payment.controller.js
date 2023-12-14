const Razorpay = require("razorpay");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");

const instance = new Razorpay({
  key_id: "rzp_test_ZQBO59H8gt0oCf",
  key_secret: "UNvHCBNRnVubAWBdspKqQbmS",
});

exports.checkout = asyncErrorHandler(async (req, res) => {
  const { amount } = req.body;
  const option = {
    amount: amount * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(option);
  res.json({
    success: true,
    order,
  });
});

exports.paymentVerfication = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;
  res.json({
    razorpayOrderId,
    razorpayPaymentId,
  });
};
