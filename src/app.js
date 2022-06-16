require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hbs = require("hbs");
require("./db/conn");
const cookie_parser = require("cookie-parser");
const flash = require("connect-flash");
var cookieSession = require("cookie-session");

const port = process.env.PORT || 3000;
const templatePath = path.join(__dirname, "./templates/views");
const partialPath = path.join(__dirname, "./templates/partials");
const staticPath = path.join(__dirname, "public");

app.use(cookie_parser("keyboard cat"));
app.use(
  cookieSession({
    name: "session",
    keys: ["keyboard cat"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
app.set(hbs.registerPartials(partialPath));

app.use("/", userRoutes);
app.use("/cart/", cartRoutes);
app.use("/admin/", adminRoutes);

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("status", async (data, _id) => {
    socket.broadcast.emit("set", data, _id);
  });
});
