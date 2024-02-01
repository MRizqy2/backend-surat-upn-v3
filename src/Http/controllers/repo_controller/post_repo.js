const express = require("express");
const router = express.Router();
const {
  REPO,
  DAFTAR_SURAT,
  USERS,
  JABATAN,
  FAKULTAS,
  PRODI,
  JENIS_SURAT,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const postRepo = async (req, res) => {
  try {
    let surat_id;
    if (req && typeof req.body !== "undefined") {
      surat_id = req.body.surat_id;
      user_id = req.b;
    } else {
      surat_id = req.save.surat_id;
    }
    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });

    if (!surat) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Surat not found" });
    }

    const user = await USERS.findOne({
      where: { id: surat.user_id },
    });
    const role = await JABATAN.findOne({
      where: { id: user.role_id },
    });

    const jenis = await JENIS_SURAT.findOne({
      where: { id: surat.jenis_id },
    });

    const prodi = await PRODI.findOne({
      where: { id: user.prodi_id },
    });
    const fakultas = await FAKULTAS.findOne({
      where: { id: user.fakultas_id },
    });
    const data_user = `${user.id}/${user.name}/${role.name}/${prodi.name}/${fakultas.name}`;
    const repo = await REPO.create({
      judul: surat.judul,
      jenis: jenis.jenis,
      data_user: data_user,
      tanggal: surat.tanggal,
      url: surat.url,
    });

    if (req && typeof req.body !== "undefined") {
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "Repo created successfully", repo });
    } else {
      return `repo telah dibuat`;
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postRepo);

module.exports = { postRepo, router };
