const { StatusCodes } = require("http-status-codes");
const express = require("express");
const app = express.Router();
const { USERS } = require("../../../models");

const putUser = async (req, res) => {
  try {
    const { name, email, jabatan_id, prodi_id, fakultas_id, aktif } = req.body;
    const { user_id } = req.query;

    const user = await USERS.findOne({
      where: { id: user_id },
    });

    const updatedUser = await USERS.update(
      {
        name: name || user.name,
        email: email || user.email,
        // password: password || ,
        jabatan_id: jabatan_id || user.jabatan_id,
        prodi_id: prodi_id || user.prodi_id,
        fakultas_id: fakultas_id || user.fakultas_id,
        aktif: aktif || user.aktif,
      },
      {
        where: {
          id: user_id,
        },
        returning: true,
      }
    );

    // Ambil data user yang telah diperbarui
    const resultUser = await USERS.findOne({
      where: { id: user_id },
      attributes: { exclude: ["password"] }, // Perbaikan pada properti attributes
    });

    if (req.body.from) {
      // Jika parameter from disertakan, kembalikan data user yang diperbarui
      return resultUser;
    } else {
      // Jika tidak, kirim respons JSON dengan data user yang diperbarui
      res.status(StatusCodes.OK).json({ user: resultUser });
    }
  } catch (error) {
    // Tangani kesalahan dan kirim respons kesalahan
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

app.put("/", putUser);

module.exports = { putUser, app };
