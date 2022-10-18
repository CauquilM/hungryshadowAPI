const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");

mongoose.connect(
  "mongodb+srv://MatDev:LgfC8my3rxllpe3X@cluster0.7cwnoib.mongodb.net/shadowdb?retryWrites=true&w=majority",
  { useNewUrlParser: true },
  () =>
    console.log(
      `Connection ${new Date().getHours()}:${new Date().getMinutes()}`
    )
);

app.use(cors());
app.use(bodyParser.json());

const posts = require("./routes/posts");
const users = require("./routes/users");

app.use("/posts", posts);
app.use("/auth", users);

app.listen(process.env.PORT || 3000);
