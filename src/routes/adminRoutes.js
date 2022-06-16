const express = require("express");
const auth = require("../middlewere/auth");
const router = new express.Router();
const {
  showAdmin,
  addPizza,
  showAddPizza,
  seeUser,
  setStatus,
} = require("../controller/adminController");

router.get("/home", auth, showAdmin);
router.get("/addpizza", auth, showAddPizza).post("/addpizza", addPizza);
router.get("/seeUser", auth, seeUser);
router.post("/setStatus", auth, setStatus);

module.exports = router;
