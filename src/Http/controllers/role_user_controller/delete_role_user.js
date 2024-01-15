const express = require("express");
const { Role_user } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const deleteRole =
  (isAdmin,
  async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Parameter 'id' is required" });
      }

      const deletedRole = await Role_user.destroy({
        where: { id: id },
      });

      if (deletedRole) {
        res.status(200).json({ message: "Role deleted successfully" });
      } else {
        res.status(404).json({ error: "Role not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.delete("/", deleteRole, isAdmin);

module.exports = {
  deleteRole,
  router,
};
