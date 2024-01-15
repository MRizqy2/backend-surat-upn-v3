const express = require("express");
const { Prodi, Fakultas } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const putProdi =
  (isAdmin,
  async (req, res) => {
    try {
      const { name, kode_prodi, fakultas_id } = req.body;
      const { id } = req.query;
      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid params" });
      }

      const prodi = await Prodi.findOne({ where: { id: id } });

      if (!prodi) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Prodi not found" });
      }

      prodi.name = name;
      prodi.kode_prodi = kode_prodi;
      prodi.fakultas_id = fakultas_id;

      await prodi.save();

      res.status(StatusCodes.OK).json({
        message: "success update",
        updated: prodi.name,
        kode_prodi,
        fakultas_id,
      });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  });

router.put("/", isAdmin, putProdi);

module.exports = {
  putProdi,
  router,
};