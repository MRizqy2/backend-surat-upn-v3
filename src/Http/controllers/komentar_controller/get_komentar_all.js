const express = require("express");
const { KOMENTAR, JABATAN } = require("../../../models");
const router = express.Router();

const getAll = async function (req, res) {
  // const { surat_id } = req.query;

  const komentar = await KOMENTAR.findAll({
    // where: { surat_id: surat_id },
    include: [
      {
        model: JABATAN,
        as: "jabatan_ke",
        attributes: ["name"],
      },
      {
        model: JABATAN,
        as: "jabatan_dari",
        attributes: ["name"],
      },
    ],
    attributes: ["komentar", "surat_id"],
    order: [["id", "DESC"]],
  });

  if (req.query.from) return komentar;
  else res.send();
};

router.get("/", getAll);

module.exports = {
  getAll,
  router,
};
