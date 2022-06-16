const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Pizza = require("../model/pizzaModel");
const Order = require("../model/orderModel");

const getPizza = async () => {
  try {
    const all = await Pizza.find({});
    const veg = await Pizza.find({ category: "veg" });
    const non_veg = await Pizza.find({ category: "non-veg" });
    return { all, veg, non_veg };
  } catch (err) {
    console.log(err);
  }
};

const showRegister = (req, res) => {
  res.render("register");
};

const showLogin = (req, res) => {
  res.render("login", { msg: req.flash("success") });
};

const createUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      cpasswords,
      address,
    } = req.body;
    const isRegistered = await User.findOne({ email: email });
    if (isRegistered) {
      res.send("email already registered");
    }
    if (password !== cpasswords) {
      res.send("password and confirm password is not same");
    }
    const user = new User({
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      address,
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    const token = jwt.sign(
      { firstname, lastname, email, password },
      process.env.SECRET_KEY
    );
    res.cookie("token", token, { httpOnly: true });
    await user.save();
    req.flash("success", "Registerd Successfully");
    // console.log(createdUser);
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      if (user.firstname == "admin") {
        const token = jwt.sign(
          {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phonenumber: user.phonenumber,
            password: user.password,
          },
          process.env.SECRET_KEY
        );
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/admin/home");
      } else {
        const token = jwt.sign(
          {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phonenumber: user.phonenumber,
            password: user.password,
          },
          process.env.SECRET_KEY
        );
        const { all } = await getPizza();
        res.cookie("token", token, { httpOnly: true });
        req.flash("success", "Login Successfully.");
        res.render("home", {
          firstname: user.firstname,
          balance: user.balance,
          pizza: all,
          msg: req.flash("success"),
        });
      }
    } else {
      res.send("login failed");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    req.flash("success", "Loged Out.");
    res.redirect("/login");
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
};

const showHome = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { firstname, balance } = await User.findOne({ email: email });
    const { all } = await getPizza();
    res.render("home", {
      firstname,
      balance,
      pizza: all,
      msg: req.flash("success"),
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const showEditUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phonenumber, password } = jwt.decode(
      req.cookies.token
    );
    const { address } = await User.findOne({ email: email });
    res.render("editProfile", {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      address,
    });
  } catch (err) {
    console.log(err);
    res.sand(err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      cpasswords,
      address,
    } = req.body;
    const { all } = await getPizza();
    if (password === cpasswords) {
      hasedPassword = await bcrypt.hash(password, 10);
      const result = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            firstname,
            lastname,
            email,
            phonenumber,
            password: hasedPassword,
            address,
          },
        },
        { new: true }
      );
      req.flash("success", "Edited Successfully");
      // console.log(result);
      res.render("home", {
        firstname,
        balance: result.balance,
        pizza: all,
        msg: req.flash("success"),
      });
    } else {
      res.send("password and confirm password is not same");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const showBalance = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { balance, firstname } = await User.findOne({ email });
    res.render("balance", {
      balance,
      firstname,
      msg: req.flash("success"),
    });
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
};

const addBalance = async (req, res) => {
  try {
    const { email, firstname } = jwt.decode(req.cookies.token);
    const { password } = req.body;
    const user = await User.findOne({ email });
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const result = await User.findOneAndUpdate(
        { email },
        { $inc: { balance: req.body.balance } },
        { new: true }
      );
      // console.log(result);
      req.flash("success", "Balance Added Successfully");
      res.render("balance", {
        firstname,
        balance: result.balance,
        msg: req.flash("success"),
      });
    } else {
      res.send("Wrong Password");
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const displayByCategory = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { firstname, balance } = await User.findOne({ email });
    const { action } = req.body;
    const { all, veg, non_veg } = await getPizza();
    if (action == "veg") {
      res.render("home", { firstname, balance, pizza: veg });
    } else if (action == "non-veg") {
      res.render("home", { firstname, balance, pizza: non_veg });
    } else {
      res.render("home", { firstname, balance, pizza: all });
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showAddAddress = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { firstname, balance } = await User.findOne({ email });
    res.render("addAddress", {
      firstname,
      balance,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const addAddress = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { address } = await User.findOne({ email });
    const nAddress = req.body.address;
    address.push(nAddress);
    await User.findOneAndUpdate({ email }, { $set: { address } });
    res.redirect("/cart/payment");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const myBookings = async (req, res) => {
  try {
    const { email } = jwt.decode(req.cookies.token);
    const { _id, firstname, balance } = await User.findOne({ email });

    const order = await Order.find({ userid: _id }).sort({ bookingDate: -1 });
    res.render("myBookings", {
      firstname,
      balance,
      order,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

// const showCart = async (req, res) => {
//   try {
//     const { email } = jwt.decode(req.cookies.token);
//     const { firstname, balance } = await User.findOne({ email });
//     res.render("cart", {
//       firstname,
//       balance,
//     });
//   } catch (err) {
//     console.log(err);
//     res.send(err.message);
//   }
// };

module.exports = {
  showRegister,
  showLogin,
  createUser,
  loginUser,
  showHome,
  logoutUser,
  showEditUser,
  updateUser,
  showBalance,
  addBalance,
  displayByCategory,
  showAddAddress,
  addAddress,
  myBookings,
};
