const express = require("express");
const { Notifikasi } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const app = express.Router();

app.post("/", async function (req, res) {
  const { surat_id, role_id_dari, role_id_ke } = req.body;

  try {
    // Find all users with the 'role_id_ke'
    const users = await User.findAll({
      where: {
        role_id: role_id_ke,
        id: {
          [Op.ne]: role_id_dari, // Exclude the sender
        },
      },
    });

    // Create a notification for each user
    const notifications = await Promise.all(
      users.map((user) => {
        return Notifikasi.create({
          surat_id: surat_id,
          role_id_dari: role_id_dari,
          role_id_ke: user.id, // Use the user's ID
        });
      })
    );

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Notifications successfully created", notifications });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});
