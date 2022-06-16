const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const isVerify = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

module.exports = auth;
