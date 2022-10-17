const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");

app.use(cors());
app.use(bodyParser.json());

const posts = require("./api/posts");
const users = require("./api/users");

app.use("/api/posts", posts);
app.use("/api/auth", users);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log(`Connection ${new Date().getHours()}:${new Date().getMinutes()}`)
);
app.listen(3000);
