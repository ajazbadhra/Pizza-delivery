const express = require("express");
const router = new express.Router();
const auth = require("../middlewere/auth");
const {
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
} = require("../controller/userController");

router.get("/register", showRegister).post("/register", createUser);
router.get("/login", showLogin).post("/login", loginUser);
router.get("/home", auth, showHome);
router.get("/logout", logoutUser);
router.get("/edit", auth, showEditUser).post("/edit", updateUser);
router.get("/balance", auth, showBalance).post("/balance", addBalance);
router.post("/category", auth, displayByCategory);
router
  .get("/addAddress", auth, showAddAddress)
  .post("/addAddress", auth, addAddress);
router.get("/myBookings", auth, myBookings);

module.exports = router;
