const express = require("express");
const { FOLDER } = require("../../../models");
const router = express.Router();
const fs = require("fs");

const postFolder = async function (req, res) {
  try {
    const { name } = req.body;

    const folder = await FOLDER.create({
      name,
    });

    const mainPath = "repo";
    if (!fs.existsSync(mainPath)) {
      fs.mkdirSync(mainPath);
    }
    const folderPath = `${mainPath}/${folder.name}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    return res.status(201).json({ message: `${folder.name} created successfully` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

router.get("/", postFolder);

module.exports = { postFolder, router };
