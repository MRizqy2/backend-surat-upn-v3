const express = require("express");
const { INDIKATOR } = require("../../../../models/");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const putIndikator = async (req, res) => {
  try {
    const { indikator_id } = req.query;
    const { nama, nomor } = req.body;
    const indikator = await INDIKATOR.update(
      {
        nama,
        nomor,
      },
      {
        where: {
          indikator_id,
        },
        returning: true,
      }
    );
    res.status(StatusCodes.OK).json({
      message: "Indikator updated successfully",
      indikator,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.put("/", putIndikator);

module.exports = { router, putIndikator };
