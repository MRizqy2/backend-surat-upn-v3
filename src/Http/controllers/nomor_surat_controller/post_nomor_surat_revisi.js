const express = require("express");
const { NOMOR_SURAT, REVISI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { OCR } = require("./../ocr_controller/ocr_controller");
// const { repo } = require("./../repo_controller/repo_controller");
const router = express.Router();

const postNomorSuratRevisi = async (req, res) => {
  try {
    const { surat_id, indikator_id } = req.body;

    let nomor;
    let nomor_surat;
    let updateNomorSurat;

    const revisiSurat = await REVISI.findOne({
      where: { surat_id_baru: surat_id },
    });

    const nomor_surat_lama = await NOMOR_SURAT.findOne({
      where: { surat_id: revisiSurat.surat_id_lama },
    });

    nomor = nomor_surat_lama.nomor_surat;
    const nomorSuratSplit = nomor.split("/");
    const nomorSplit = nomorSuratSplit[0];
    const nomorSplitv2 = nomorSplit.split(".");

    if (nomorSuratSplit.length === 5 && nomorSplitv2.length === 2) {
      nomorRevisi = parseInt(nomorSplitv2[1], 10);
      nomorRevisi++;
      updateNomorSurat = `${nomorSplitv2[0]}.${nomorRevisi}/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    } else if (nomorSuratSplit.length === 5) {
      updateNomorSurat = `${nomorSuratSplit[0]}.1/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    }
    nomor_surat = String(nomor_surat);

    const saveNomorSurat = await NOMOR_SURAT.create({
      nomor_surat: updateNomorSurat,
      surat_id: surat_id,
      periode_id: nomor_surat_lama.periode_id,
    });

    const reqOcr = {
      body: {
        nomor_surat_id: saveNomorSurat.id,
        surat_id: saveNomorSurat.surat_id,
        from: `nomor_surat_controller`,
      },
    };

    const saveOcr = await OCR(reqOcr);
    if (!saveOcr) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to save OCR" });
    }
    // const reqRepo = {
    //   save: {
    //     surat_id: saveNomorSurat.surat_id,
    //     from: `nomor_surat_controller`,
    //   },
    // };
    // const saveRepo = await repo(reqRepo);

    if (saveNomorSurat && saveOcr) {
      return (res = { message: "Success", saveNomorSurat, saveOcr });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to save nomor surat" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.post("/", postNomorSuratRevisi);
module.exports = {
  postNomorSuratRevisi,
  router,
};
