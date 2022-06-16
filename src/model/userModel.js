const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(vlaue) {
      if (!validator.isEmail(vlaue)) {
        throw new Error("Invalid email");
      }
    },
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    required: false,
  },
  address: [{ type: String, required: true, trim: true }],
});

const User = new mongoose.model("User", UserSchema);

module.exports = User;
