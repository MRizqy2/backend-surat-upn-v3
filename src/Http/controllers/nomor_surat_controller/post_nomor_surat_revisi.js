const express = require("express");
const {
  NOMOR_SURAT,
  DAFTAR_SURAT,
  USERS,
  PRODI,
  FAKULTAS,
  JABATAN,
  PERIODE,
  JENIS_SURAT,
  REVISI,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { OCR } = require("./../ocr_controller/ocr_controller");
// const { repo } = require("./../repo_controller/repo_controller");
const router = express.Router();

const postNomorSuratRevisi = async (req, res) => {
  try {
    const { surat_id } = req.body;

    let nomor;
    let nomor_surat;
    let updateNomorSurat;

    const user_login = await USERS.findOne({
      where: { id: req.token.id },
    });

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });

    const jenis = await JENIS_SURAT.findOne({
      where: { id: surat.jenis_id },
    });

    const revisiSurat = await REVISI.findOne({
      where: { surat_id_baru: surat_id },
    });

    const nomor_surat_lama = await NOMOR_SURAT.findOne({
      where: { surat_id: revisiSurat.surat_id_lama },
    });

    // const nomor_surat_per_periode_dan_jenis = await NOMOR_SURAT.count({
    //   where: {
    //     periode_id: active_periodes[0].id,
    //     "$daftar_surat.jenis_id$": jenis.id,
    //   },
    //   include: [
    //     {
    //       model: DAFTAR_SURAT,
    //       as: "daftar_surat",
    //     },
    //   ],
    // });

    // if (nomor_surat_per_periode_dan_jenis > 0) {
    //   nomor = await NOMOR_SURAT.findAll({
    //     limit: 1,
    //     order: [["id", "DESC"]],
    //     where: {
    //       periode_id: active_periodes[0].id,
    //       "$daftar_surat.jenis_id$": jenis.id,
    //     },
    //     include: [
    //       {
    //         model: DAFTAR_SURAT,
    //         as: "daftar_surat",
    //       },
    //     ],
    //   });

    //   const existingNomor = nomor[0].nomor_surat;
    //   const parts = existingNomor.split("/");
    //   const angkaNomor = parts[0];

    //   nomor_surat = String(parseInt(angkaNomor, 10) + 1).padStart(4, "0");
    // } else {
    //   nomor_surat = "0001"; // Jika tidak ada nomor sebelumnya, dimulai dari 1
    // }

    const user_surat = await USERS.findOne({
      where: { id: surat.user_id },
    });

    if (!user_surat || !user_login) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const jabatan_user_surat = await JABATAN.findOne({
      where: { id: user_surat.jabatan_id },
    });

    const prodi_user_surat = await PRODI.findOne({
      where: { id: user_surat.prodi_id },
    });
    if (!prodi_user_surat) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Prodi not found" });
    }
    const fakultas_id = user_login.fakultas_id;

    const fakultas = await FAKULTAS.findOne({
      where: { id: fakultas_id },
    });

    if (!fakultas) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Fakultas not found" });
    }

    // const nama_jabatan = jabatan_user_surat.name;
    // const kode_prodi = prodi_user_surat.kode_prodi;
    // const kode_fakultas = fakultas.kode_fakultas;
    // const kode_jenis_surat = jenis.kode_jenis;
    // const temp_tahun_periode = String(active_periodes[0].tahun);
    // const tahun_periode = temp_tahun_periode.split(" ")[3];
    nomor = nomor_surat_lama.nomor_surat;
    const nomorSuratSplit = nomor.split("/");
    console.log("mvw[epq", nomorSuratSplit);
    const nomorSplit = nomorSuratSplit[0];
    console.log("ntwgr", nomorSplit); //mvopmp [ '0002' ]
    const nomorSplitv2 = nomorSplit.split(".");
    console.log("mvopmp", nomorSplitv2);

    if (nomorSuratSplit.length === 5 && nomorSplitv2.length === 2) {
      nomorRevisi = parseInt(nomorSplitv2[1], 10);
      nomorRevisi++;
      updateNomorSurat = `${nomorSplitv2[0]}.${nomorRevisi}/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    } else if (nomorSuratSplit.length === 5) {
      updateNomorSurat = `${nomorSuratSplit[0]}.1/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    }
    nomor_surat = String(nomor_surat);
    console.log("testitn 2", nomor_surat);
    const saveNomorSurat = await NOMOR_SURAT.create({
      nomor_surat: updateNomorSurat,
      surat_id: surat_id,
      periode_id: nomor_surat_lama.periode_id,
    });

    const reqOcr = {
      save: {
        nomor_surat_id: saveNomorSurat.id,
        surat_id: saveNomorSurat.surat_id,
        from: `nomor_surat_controller`,
      },
    };
    console.log("ompo[k");
    const saveOcr = await OCR(reqOcr);
    if (!saveOcr) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to save OCR" });
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
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR) //
        .json({ error: "Failed to save nomor surat" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postNomorSuratRevisi);
module.exports = {
  postNomorSuratRevisi,
  router,
};
