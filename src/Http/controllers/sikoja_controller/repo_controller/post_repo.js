const express = require("express");
const router = express.Router();
const { REPO } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const postRepo = async (req, res) => {
  try {
    const { surat_id, indikator_id, catatan } = req.body;

    const timestamp = Date.now();
    const randomString = crypto.randomBytes(6).toString("hex");
    const unix_code = `${randomString}${timestamp}`
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    const repo = await REPO.create({
      surat_id,
      unix_code,
      catatan,
      indikator_id,
    });

    if (req.body.from) {
      return repo;
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: `repo telah dibuat`, repo });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postRepo);

module.exports = { postRepo, router };
