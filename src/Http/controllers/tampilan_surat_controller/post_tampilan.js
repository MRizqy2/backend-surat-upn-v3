const express = require("express");
const app = express.Router();
const router = express.Router();
const { Tampilan, Daftar_surat, Users, Role_user } = require("../../models");
const getStatus = require("../controllers/daftar_surat_controller/status_controller");
const putStatus = require("./status_surat_controller");
const { StatusCodes } = require("http-status-codes");
const { Sequelize } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postTampilan = async (req, res) => {
  try {
    if (req.body) {
      const { surat_id } = req.body;
    }
    const surat = await Daftar_surat.findOne({
      where: { id: req.save.surat_id ? req.save.surat_id : surat_id },
    });
    const user = await Users.findOne({
      where: { id: req.save.user_id ? req.save.user_id : req.token.id },
    });

    const role_user = await Role_user.findOne({
      where: { id: req.save.role_id ? req.save.role_id : user.role_id },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }
    let tamp_surat_prodi;
    let tamp_surat_tu;
    let tamp_surat;

    if (req.save.from === `daftar_surat_controller/cloudinary_controller`) {
      tamp_surat_prodi = await Tampilan.create({
        pin: false,
        dibaca: false,
        surat_id: surat.id,
        role_id: role_user.id,
      });

      const role_tu = await Role_user.findOne({
        // attributes: [[Sequelize.fn("LOWER", Sequelize.col("name")), "TU"]],
        where: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          "tu"
        ),
      });
      if (!role_tu) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "Role_user (TU) not found",
        });
      }
      tamp_surat_tu = await Tampilan.create({
        pin: false,
        dibaca: false,
        surat_id: surat.id,
        role_id: role_tu.id,
      });
    } else if (req.save.from === "status_surat_controller") {
      const role_dekan = await Role_user.findOne({
        // attributes: [[Sequelize.fn("LOWER", Sequelize.col("name")), "TU"]],
        where: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          "dekan"
        ),
      });
      if (!role_dekan) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "Role_user (Dekan) not found",
        });
      }
      tamp_surat_dekan = await Tampilan.create({
        pin: false,
        dibaca: false,
        surat_id: surat.id,
        role_id: role_dekan.id,
      });
    } else {
      tamp_surat = await Tampilan.create({
        pin: false,
        dibaca: false,
        surat_id: surat.id,
        role_id: role_user.id,
      });
    }

    if (!req.save.from) {
      res.status(StatusCodes.OK).json({ tampilan: tamp_surat });
    } else if (
      req.save.from === `daftar_surat_controller/cloudinary_controller`
    ) {
      return {
        tamp_surat_prodi,
        tamp_surat_tu,
      };
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.post("/", postTampilan);

module.exports = {
  router,
  postTampilan, // export this function so it can be used elsewhere
  app,
};
