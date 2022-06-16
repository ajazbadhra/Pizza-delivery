const jwt = require("jsonwebtoken");
const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Pizza = require("../model/pizzaModel");
const Order = require("../model/orderModel");
const bcrypt = require("bcrypt");

const addToCart = async (req, res) => {
  try {
    const pizzaId = req.body.addToCart;
    const qty = req.body.qty;
    // console.log(req.body);

    const { email } = jwt.decode(req.cookies.token);
    const { _id } = await User.findOne({ email: email });
    const pizza = await Pizza.findById({ _id: pizzaId });
    const cart = new Cart({
      userid: _id,
      products: [
        {
          name: pizza.name,
          qty: parseInt(qty),
          price: pizza.price * qty,
          img: pizza.img,
        },
      ],
    });
    await cart.save();
    req.flash("success", "Added to Cart.... ");
    res.redirect("/home");
    // res.render("home", {
    //   firstname,
    //   balance,s
    // });
    // console.log(created);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const getCart = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { _id, firstname, balance } = await User.findOne({ email: email });
    const cart = await Cart.find({ userid: _id });
    let sum = 0;
    let tqty = 0;
    cart.forEach((e) => {
      sum += e.products[0].price;
      tqty += e.products[0].qty;
    });
    // console.log(cart);
    res.render("cart", {
      firstname,
      balance,
      cart,
      sum,
      tqty,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showPayment = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { _id, firstname, balance, address } = await User.findOne({
      email: email,
    });

    const cart = await Cart.find({ userid: _id });
    let sum = 0;
    cart.forEach((e) => {
      sum += e.products[0].price;
    });
    if (sum > balance) {
      res.render("payment", {
        firstname,
        balance,
        address,
        sum,
        msg: "!Not Sufficient Balance, Add Money to Wallet.",
      });
    } else {
      res.render("payment", { firstname, balance, address, sum });
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const makePayment = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { password, _id, balance } = await User.findOne({
      email: email,
    });
    const { selectedAddress, amount, payPassword, sum } = req.body;
    const isValid = await bcrypt.compare(payPassword, password);

    if (isValid) {
      if (sum > balance) {
        req.flash("success", "Add Balance to Proceed Ahead.");
        res.redirect("/balance");
      } else {
        const order = new Order({
          userid: _id,
          price: parseInt(sum),
          address: selectedAddress,
        });
        await order.save();

        await Cart.deleteMany({ userid: _id });
        await User.findOneAndUpdate({ email }, { $inc: { balance: -sum } });
        req.flash("success", "Hurryya...Payment Done, Orderd Placesd");
        res.redirect("/home");
      }
    } else {
      res.send("password invalid");
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
module.exports = { addToCart, getCart, showPayment, makePayment };
