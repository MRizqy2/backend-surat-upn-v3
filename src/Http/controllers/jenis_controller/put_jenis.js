const express = require("express");
const { Jenis_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putJenis = async function (req, res) {
  try {
    const { jenis } = req.body;
    const { id } = req.query;

    const jenis_id = await Jenis_surat.findOne({ where: { id: id } });

    if (!jenis_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }
    const jenis_surat = await Jenis.update(
      {
        jenis: jenis,
      },
      {
        where: { id: id },
        returning: true,
      }
    );

    return res.json({ message: "update berhasil", jenis_surat });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.put("/", putJenis);

module.exports = {
  putJenis,
  router,
};
