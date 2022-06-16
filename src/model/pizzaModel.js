const mongoose = require("mongoose");

const PizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
    enum: ["veg", "non-veg"],
    default: "veg",
  },
  desc: {
    type: String,
    require: true,
  },
  img: String,
});

const Pizza = new mongoose.model("Pizza-Detail", PizzaSchema);

module.exports = Pizza;
