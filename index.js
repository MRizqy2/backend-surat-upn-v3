const express = require("express");
const app = express();
require("dotenv").config();
require("pg");
const router = require("./src/routes/index.js");
const cors = require("cors");
const ColorGreen = "\x1b[32m";
const zip = require("express-easy-zip");

app.use(express.json());
app.use(cors());
app.use(zip());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(
    "%c%s is running on port %s",
    ColorGreen,
    process.env.NGROK,
    process.env.PORT
  );

  console.log(`${process.env.NGROK} on port ${process.env.PORT}`);
});
