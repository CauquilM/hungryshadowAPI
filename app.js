const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");

app.use(cors());
app.use(bodyParser.json());

const posts = require("./routes/posts");
const users = require("./routes/users");

app.use("/", posts);
app.use("/", users);

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true },
  () =>
    console.log(
      `Connection ${new Date().getHours()}:${new Date().getMinutes()}`
    )
  
);
app.listen(3000);
