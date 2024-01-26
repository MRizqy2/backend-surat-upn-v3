const express = require("express");
const app = express();
require("dotenv").config();
require("pg");
const router = require("./src/routes/index.js");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(router);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
