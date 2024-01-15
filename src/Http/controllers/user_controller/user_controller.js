const { getUser } = require("./get_user");
const { putUser } = require("./put_user");
const { deleteUser } = require("./delete_user");

const express = require("express");
const app = express.Router();

app.get("/", getUser);
app.put("/password", putUser);
app.delete("/", deleteUser);

module.exports = app;
