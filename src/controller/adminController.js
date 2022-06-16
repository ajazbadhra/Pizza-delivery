const Pizza = require("../model/pizzaModel");
const User = require("../model/userModel");
const Order = require("../model/orderModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// console.log(path.join(__dirname + "../public/images/1651817486903-new.jpg"));

const showAdmin = async (req, res) => {
  try {
    const user = (await User.find({}).count().exec()) - 1;
    const all = await Pizza.find({}).count().exec();
    const veg = await Pizza.find({ category: "veg" }).count().exec();
    const non_veg = all - veg;
    const order = await Order.find({
      status: { $ne: "Completed" },
    }).populate("userid", ["firstname", "lastname"]);
    // console.log(order);

    res.render("admin", {
      user,
      all,
      veg,
      non_veg,
      order,
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const showAddPizza = async (req, res) => {
  res.render("addPizza");
};

const addPizza = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: path.join(__dirname, "../public/images"),
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });
    const upload = multer({
      storage,
    }).single("img");

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
      } else {
        const { name, price, category, desc } = req.body;
        const pizza = new Pizza({
          name,
          price,
          category,
          desc,
          img: path.join("/images/" + req.file.filename),
        });
        await pizza.save();
        // console.log(result);
      }
    });

    res.render("addPizza");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const seeUser = async (req, res) => {
  try {
    // const user = await Order.find({}).populate("userid", "-password");
    // console.log(user);

    const user = await User.find({}).select(["_id", "firstname", "lastname"]);

    const result = [];
    user.forEach(async (u) => {
      var c = await Order.find({ userid: u._id }).count();
      if (c >= 1) {
        const obj = {};
        obj["name"] = `${u.firstname} ${u.lastname}`;
        obj["count"] = c;
        result.push(obj);
      }
    });

    res.render("seeUser", { result });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const setStatus = async (req, res) => {
  try {
    const { status, _id } = req.body;
    const result = await Order.findOneAndUpdate(
      { _id },
      { $set: { status: status } },
      { new: true }
    );
    // console.log(result);
    res.redirect("/admin/home");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

module.exports = { showAdmin, addPizza, showAddPizza, seeUser, setStatus };
