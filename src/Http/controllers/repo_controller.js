const express = require("express");
const router = express.Router();
const {
  Repo,
  Daftar_surat,
  Users,
  Role_user,
  Fakultas,
  Prodi,
} = require("../../models");
const { StatusCodes } = require("http-status-codes");
// const app = express.Router();

const repo = async (req, res) => {
  const { surat_id } = id;

  try {
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
    const prodi = await Prodi.findOne({
      where: { id: u.user_id },
    });
    const fakultas = await Fakultas.findOne({
      where: { id: user.fakultas_id },
    });
    const data_user = `${user.id}/${user.name}/${role.name}/${prodi.name}/${fakultas.name}`;

    const repo = await Repo.create({
      judul: surat.judul,
      jenis: surat.jenis,
      data_user: data_user,
      tanggal: surat.tanggal,
      url: surat.url,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Repo created successfully", repo });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", repo);

module.exports = { repo, router };
