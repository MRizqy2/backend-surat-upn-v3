const express = require("express");
const { Users } = require("../../../models");
const bcrypt = require("bcryptjs");
const router = express.Router();

const app = express.Router();

const putUser = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await Users.findOne({ where: { id: req.token.id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password does not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [updated] = await Users.update(
      { password: hashedPassword },
      {
        where: { id: req.token.id },
      }
    );

    if (updated) {
      res.json({ message: `${user.email} Password updated successfully` });
    } else {
      res.status(500).json({ error: "Failed to update password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

router.put("/update", putUser);

module.exports = {
  router,
  putUser,
  app,
};
