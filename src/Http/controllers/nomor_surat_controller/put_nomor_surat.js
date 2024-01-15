const express = require("express");
const {
  Nomor_surat,
  Daftar_surat,
  Users,
  Prodi,
  Fakultas,
  Periode,
} = require("../../models");
const { StatusCodes } = require("http-status-codes");
const { OCR } = require("./ocr_controller");
// const { repo } = require("./repo_controller");
const app = express.Router();

app.post("/", async (req, res) => {
  try {
    const { surat_id } = req.body; //

    let nomor;
    let nomor_surat;

    const active_periodes = await Periode.findAll({
      where: { status: true },
    });
    // console.log("dasve");
    if (active_periodes.length !== 1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Active period should be exactly 1" });
    } else if (!active_periodes) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No Periode active" });
    }
    // console.log("brgb");
    const nomor_surat_per_periode = await Nomor_surat.count({
      where: { periode_id: active_periodes[0].id },
    });
    console.log("vmwivei");

    if (nomor_surat_per_periode > 0) {
      nomor = await Nomor_surat.findAll({
        limit: 1,
        order: [["id", "DESC"]],
        where: { periode_id: active_periodes[0].id },
      });
      nomor_surat = String(parseInt(nomor[0].nomor_surat, 10) + 1);
    } else {
      nomor_surat = "1"; // Jika tidak ada nomor sebelumnya, dimulai dari 1
      // console.log("testing");
    }

    // if (nomor && nomor.length > 0) {
    //   // Menggunakan padStart untuk memastikan panjang nomor_surat selalu 10 karakter
    //   nomor_surat = String(parseInt(nomor[0].nomor_surat, 10) + 1);
    // } else {
    //   nomor_surat = "1"; // Jika tidak ada nomor sebelumnya, dimulai dari 1
    // }

    const user_dekan = await Users.findOne({
      where: { id: req.token.id }, //token
    });

    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });

    const user_surat = await Users.findOne({
      where: { id: surat.user_id },
    });

    if (!user_surat || !user_dekan) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const prodi = await Prodi.findOne({
      where: { id: user_surat.prodi_id },
    });
    if (!prodi) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Prodi not found" });
    }
    const fakultas_id = user_dekan.fakultas_id;
    // console.log("sasda", fakultas_id);
    const fakultas = await Fakultas.findOne({
      where: { id: fakultas_id },
    });
    // console.log("tesising", fakultas.kode_fakultas);
    if (!fakultas) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Fakultas not found" });
    }

    const kode_prodi = prodi.kode_prodi;
    const kode_fakultas = fakultas.kode_fakultas;
    const temp_tahun_periode = String(active_periodes[0].tahun);
    const tahun_periode = temp_tahun_periode.split(" ")[3];

    nomor_surat = `${nomor_surat}/${kode_fakultas}/TU_${kode_prodi}/${tahun_periode}`;
    nomor_surat = String(nomor_surat);
    // console.log("testitn 2", nomor_surat);

    const saveNomorSurat = await Nomor_surat.create({
      nomor_surat: nomor_surat,
      surat_id: surat_id,
      periode_id: active_periodes[0].id,
    });

    const reqOcr = {
      save: {
        nomor_surat_id: saveNomorSurat.id,
        surat_id: saveNomorSurat.surat_id,
        from: `nomor_surat_controller`,
      },
    };
    const saveOcr = await OCR(reqOcr);
    const reqRepo = {
      save: {
        surat_id: saveNomorSurat.surat_id,
        from: `nomor_surat_controller`,
      },
    };
    const saveRepo = await repo(reqRepo);

    if (saveNomorSurat && saveOcr) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Success", saveNomorSurat, saveOcr, saveRepo });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to save nomor surat" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

module.exports = app;
