const express = require("express");
const { IKU } = require("../../../models/");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const deleteIku = async (req, res) => {
  try {
    const { iku_id } = req.query;

    // Gunakan findByPk untuk mencari berdasarkan primary key
    const iku = await IKU.findByPk(iku_id);

    // Periksa apakah IKU ditemukan
    if (!iku_id) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "IKU not found" });
    }

    // Hapus IKU
    await IKU.destroy({
      where: { id: iku_id },
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "IKU has been deleted", iku });
  } catch (error) {
    // Tangani kesalahan dengan mengembalikan status 500
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

router.delete("/", deleteIku);

module.exports = { deleteIku, router };
