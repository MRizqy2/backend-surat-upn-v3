const express = require("express");
const { Komentar, Users, Role_user, Daftar_surat } = require("../../../models");
const router = express.Router();

const getAll = async function (req, res) {
  res.send(
    await Komentar.findAll({
      include: [
        {
          model: Role_user,
          as: "role",
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
