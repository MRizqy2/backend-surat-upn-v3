const express = require("express");
const { USERS } = require("../../../models");
const bcrypt = require("bcryptjs");

const app = express.Router();

const putUserPass = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await USERS.findOne({ where: { id: req.token.id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password does not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [updated] = await USERS.update(
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

app.put("/update", putUserPass);

module.exports = {
  putUserPass,
  app,
};
