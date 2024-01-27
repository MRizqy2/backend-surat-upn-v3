const express = require("express");
const router = express.Router();
const {
  Repo,
  Daftar_surat,
  Users,
  Role_user,
  Fakultas,
  Prodi,
  Jenis_surat,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const postRepo = async (req, res) => {
  try {
    let surat_id;
    console.log("sadw", req.save.surat_id);
    if (req && typeof req.body !== "undefined") {
      surat_id = req.body.surat_id;
      user_id = req.b;
    } else {
      surat_id = req.save.surat_id;
    }
    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });

    if (!surat) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Surat not found" });
    }

    const user = await Users.findOne({
      where: { id: surat.user_id },
    });
    const role = await Role_user.findOne({
      where: { id: user.role_id },
    });

    const jenis = await Jenis_surat.findOne({
      where: { id: surat.jenis_id },
    });

    const prodi = await Prodi.findOne({
      where: { id: user.prodi_id },
    });
    const fakultas = await Fakultas.findOne({
      where: { id: user.fakultas_id },
    });
    const data_user = `${user.id}/${user.name}/${role.name}/${prodi.name}/${fakultas.name}`;
    const repo = await Repo.create({
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
