const cloudinaryController = require("./cloudinary_controller/cloudinary_controller/cloudinary_controller.js");
const { getTemplate } = require("./get_template.js");
const { deleteTemplate } = require("./delete_template.js");
const express = require("express");
const app = express.Router();

app.use("/cloudinary", cloudinaryController);
app.get("/", getTemplate);
app.delete("/delete", deleteTemplate);

module.exports = app;