const express = require("express");
const { Template_surat } = require("../../../models/index.js");
const router = express.Router();

const getTemplate = async (req, res) => {
  res.send(
    await Template_surat.findAll({
      order: [["id", "ASC"]],
    })
  );
};

router.get("/", getTemplate);

module.exports = {
  getTemplate,
  router,
};
