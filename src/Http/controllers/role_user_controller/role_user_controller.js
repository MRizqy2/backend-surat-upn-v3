const { getRole } = require("./get_role_user");
const { postRole } = require("./post_role_user");
const { putRole } = require("./put_role_user");
const { deleteRole } = require("./delete_role_user");

const express = require("express");
const app = express.Router();

app.get("/", getRole);
app.post("/", postRole);
app.put("/", putRole);
app.delete("/", deleteRole);

module.exports = app;
