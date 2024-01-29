const express = require("express");
const app = express();
require("dotenv").config();
require("pg");
const router = require("./src/routes/index.js");
const cors = require("cors");
const Color = "color:green;";
// const chalk = require("chalk");

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(
    "%c %s is running on port %s",
    Color,
    process.env.NGROK,
    process.env.PORT
  );

  console.log(`${process.env.NGROK} on port ${process.env.PORT}`);
});
