const express = require("express");
const app = express.Router();
const { HEADER_DAFTAR_SURAT } = require("../../../models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { StatusCodes } = require("http-status-codes");
const postHeaderDaftarSurat = async (req, res) => {
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
    let { from } = req.body;

    if (judul == undefined || judul == null) judul = true;
    if (nomor_surat == undefined || nomor_surat == null) nomor_surat = true;
    if (pembuat_surat == undefined || pembuat_surat == null)
      pembuat_surat = true;
    if (tanggal_dibuat == undefined || tanggal_dibuat == null)
      tanggal_dibuat = true;
    if (jenis_surat == undefined || jenis_surat == null) jenis_surat = true;
    if (indikator == undefined || indikator == null) indikator = true;
    if (strategi == undefined || strategi == null) strategi = true;

    if (!from) from = "";

    const latestHeader = await HEADER_DAFTAR_SURAT.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });

    const header = await HEADER_DAFTAR_SURAT.create({
      id: latestHeader[0].id + 1,
      user_id,
      judul,
      nomor_surat,
      pembuat_surat,
      tanggal_dibuat,
      jenis_surat,
      indikator,
      strategi,
    });
    if (!from || from == "") {
      res
        .status(StatusCodes.OK)
        .json({ message: "Header repo added successfully: ", header });
    } else return header;
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add header repo" });
  }
};

app.post("/", postHeaderDaftarSurat);

module.exports = { postHeaderDaftarSurat, app };
