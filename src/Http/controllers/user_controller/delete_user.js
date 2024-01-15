const express = require("express");
const { Users } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const deleteUser =
  (isAdmin,
  async (req, res) => {
    try {
      if (req.query.id == 1) {
        return res.status(Stat);
      }
      const deleted = await Users.destroy({
        where: { id: req.query.id },
      });
      if (deleted) {
        res.status(200).json("User deleted");
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.delete("/", deleteUser, isAdmin);

module.exports = {
  deleteUser,
  router,
};
