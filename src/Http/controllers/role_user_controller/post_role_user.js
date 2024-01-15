const express = require("express");
const { Role_user } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const postRole =
  (isAdmin,
  async (req, res) => {
    const { name } = req.body;
    try {
      const latestRole = await Role_user.findAll({
        limit: 1,
        order: [["id", "DESC"]],
      });

      const latestRoleId = parseInt(latestRole[0].id, 10);

      const role_user = await Role_user.create({
        id: latestRoleId + 1,
        name,
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: `${role_user.name} created successfully` });
    } catch (error) {
      console.error("Error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  });

router.post("/", postRole, isAdmin);

module.exports = {
  postRole,
  router,
};
