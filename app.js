const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");

app.use(cors());
app.use(bodyParser.json());

const routes = require("./routes/routes");

app.use("/", routes);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("Connection")
);
app.listen(3000);
