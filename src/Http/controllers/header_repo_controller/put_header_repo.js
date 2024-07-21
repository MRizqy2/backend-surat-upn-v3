const express = require("express");
const app = express.Router();
const { HEADER_REPO } = require("../../../models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { StatusCodes } = require("http-status-codes");
const putHeaderRepo = async (req, res) => {
  try {
    let {
      user_id,
      judul,
      nomor_surat,
      pembuat_surat,
      tanggal_dibuat,
      jenis_surat,
      indikator,
      strategi,
    } = req.body;

    if (!judul) judul = null;
    if (!nomor_surat) nomor_surat = null;
    if (!pembuat_surat) pembuat_surat = null;
    if (!tanggal_dibuat) tanggal_dibuat = null;
    if (!jenis_surat) jenis_surat = null;
    if (!indikator) indikator = null;
    if (!strategi) strategi = null;

    let dataHeader = await HEADER_REPO.findOne({ where: { id: user_id } });

    dataHeader = await HEADER_REPO.update(
      {
        judul: judul || dataHeader.judul,
        nomor_surat: nomor_surat || dataHeader.nomor_surat,
        pembuat_surat: pembuat_surat || dataHeader.pembuat_surat,
        tanggal_dibuat: tanggal_dibuat || dataHeader.tanggal_dibuat,
        jenis_surat: jenis_surat || dataHeader.jenis_surat,
        indikator: indikator || dataHeader.indikator,
        strategi: strategi || dataHeader.strategi,
      },
      { where: { user_id } }
    );

    if (dataHeader) {
      dataHeader = await HEADER_REPO.findOne({ where: { id: user_id } });
    }
    res.status(StatusCodes.OK).json({
      message: "Header repo updated successfully",
      header_repo: dataHeader,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update header repo" });
  }
};

module.exports = { putHeaderRepo, app };
