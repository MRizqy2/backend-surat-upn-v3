const express = require("express");
const {
  REVISI,
  DAFTAR_SURAT,
  JABATAN,
  USERS,
  JENIS_SURAT,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const router = express.Router();

const postRevisi = async (req, res) => {
  try {
    const { surat_id_lama, surat_id_baru } = req.body;

    const revisi = await REVISI.create({
      surat_id_lama,
      surat_id_baru,
    });

    return "sukses revisi";
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postRevisi);

module.exports = {
  postRevisi,
  router,
};
