const express = require("express");
const { Jabatan } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const postJabatan =
  (isAdmin,
  async (req, res) => {
    const { name, jabatan_atas_id, jabatan_bawah_id } = req.body;
    try {
      // const latestJabatan = await Jabatan.findAll({
      //   limit: 1,
      //   order: [["id", "DESC"]],
      // });

      // const latestJabatanId = parseInt(latestJabatan[0].id, 10);

      const jabatan = await Jabatan.create({
        // id: latestJabatanId + 1,
        name,
        jabatan_atas_id: jabatan_atas_id || null,
        jabatan_bawah_id: jabatan_bawah_id || null,
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: `${jabatan.name} created successfully` });
    } catch (error) {
      console.error("Error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  });

router.post("/", postJabatan, isAdmin);

module.exports = {
  postJabatan,
  router,
};
