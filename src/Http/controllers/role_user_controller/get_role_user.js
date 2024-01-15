const express = require("express");
const { Role_user } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const getRole =
  (isAdmin,
  async (req, res) => {
    res.send(await Role_user.findAll({ order: [["id", "ASC"]] }));
  });

router.get("/", getRole, isAdmin);
module.exports = {
  getRole,
  router,
};
