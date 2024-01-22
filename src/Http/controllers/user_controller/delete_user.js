const express = require("express");
const { Users } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteUser = async (req, res) => {
  const { user_id } = req.query;

  try {
    if (user_id == 1) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Cannot delete the default Super Admin.",
      });
    }

    const deleted = await Users.destroy({
      where: { id: user_id },
    });

    if (deleted) {
      res.status(StatusCodes.OK).json("User deleted");
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.delete("/", deleteUser);

module.exports = {
  deleteUser,
  router,
};
