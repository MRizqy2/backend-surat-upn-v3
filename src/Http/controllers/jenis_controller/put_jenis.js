const express = require("express");
const { Jenis_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putJenis = async function (req, res) {
  try {
    const { jenis } = req.body;
    const { jenis_id } = req.query;

    const searchJenis = await Jenis_surat.findOne({ where: { id: jenis_id } });

    if (!searchJenis) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }
    const jenis_surat = await Jenis_surat.update(
      {
        jenis,
      },
      {
        where: { id: jenis_id },
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
