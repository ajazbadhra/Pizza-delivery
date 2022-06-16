const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      name: String,
      qty: Number,
      price: Number,
      img: String,
    },
  ],
});

const Cart = new mongoose.model("cart", CartSchema);

module.exports = Cart;
