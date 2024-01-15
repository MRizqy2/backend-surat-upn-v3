const express = require("express");
const { Role_user } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const putRole =
  (isAdmin,
  async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Invalid params" });
      }

      const role = await Role_user.findOne({ where: { id: id } });

      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }

      role.name = name;
      await role.save();

      res.json({ updatedName: role.name + " success update" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.put("/", putRole, isAdmin);

module.exports = {
  putRole,
  router,
};
