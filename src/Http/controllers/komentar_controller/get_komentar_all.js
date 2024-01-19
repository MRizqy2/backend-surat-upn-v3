const express = require("express");
const { Komentar, Users, Jabatan, Daftar_surat } = require("../../../models");
const router = express.Router();

const getAll = async function (req, res) {
  res.send(
    await Komentar.findAll({
      include: [
        {
          model: Jabatan,
          as: "jabatan_ke",
          attributes: ["name"],
        },
        {
          model: Jabatan,
          as: "jabatan_dari",
          attributes: ["name"],
        },
      ],
      attributes: ["komentar", "surat_id"],
      order: [["id", "ASC"]],
    })
  );
};

router.get("/", getAll);

module.exports = {
  getAll,
  router,
};
