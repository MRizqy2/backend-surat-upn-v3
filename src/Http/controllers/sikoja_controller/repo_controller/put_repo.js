const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const { REPO } = require("../../../../models");

const putRepo = async (req, res) => {
  const { surat_id } = req.query;
  let { catatan } = req.query;

  const repo = await REPO.findOne({ where: { surat_id: surat_id } });

  if (!catatan && !repo.catatan) catatan = "";
  if (repo.catatan || repo.catatan != "") catatan = repo.catatan;

  const updatedRepo = await REPO.update(
    {
      catatan,
      visible: true,
    },
    {
      where: { surat_id: surat_id },
      returning: true,
    }
  );
  if (req.query.from) {
    return updatedRepo;
  }
  res.status(StatusCodes.OK).json(updatedRepo);
};

router.use("/", putRepo);

module.exports = { router, putRepo };
