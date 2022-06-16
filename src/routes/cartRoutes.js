const express = require("express");
const router = new express.Router();
const {
  addToCart,
  getCart,
  showPayment,
  makePayment,
} = require("../controller/cartController");
const auth = require("../middlewere/auth");

router.post("/addToCart", auth, addToCart);
router.get("/getCart", auth, getCart);
router.get("/payment", auth, showPayment).post("/payment", makePayment);

module.exports = router;