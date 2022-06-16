const mongoose = require("mongoose");
var d = new Date();

const OrderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookingDate: {
    type: String,
    default: d.toLocaleString([], { hour12: true }),
  },
  price: Number,
  address: String,
  status: {
    type: String,
    default: "order Placed",
  },
});

const Order = new mongoose.model("Order", OrderSchema);
module.exports = Order;
