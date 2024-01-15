const express = require("express");
const app = express.Router();
const router = express.Router();
const {
  Daftar_surat,
  Users,
  Role_user,
  Prodi,
  Fakultas,
  Status,
  Tampilan,
} = require("../../../models");
const auth = require("../../middleware/authMiddleware");
const cloudinaryController = require("./cloudinary_controller/cloudinary_controller");
const { StatusCodes } = require("http-status-codes");
const getStatus = require("../status_surat_controller/status_controller");
const { Op, Sequelize } = require("sequelize");

app.use(express.json()); //
app.use(express.urlencoded({ extended: true }));

const getDaftarSurat = async function (req, res) {
  const user = await Users.findOne({
    where: { id: req.token.id },
  });
  const role = await Role_user.findOne({
    where: { id: user.role_id },
  });

  if (role.name == "TU" || role.name === "Super Admin") {
    res.send(
      await Daftar_surat.findAll({
        include: [
          {
            model: Tampilan,
            as: "tampilan",
            attributes: ["pin", "dibaca"],
          },
          {
            model: Users,
            as: "user",
            attributes: ["name", "email", "aktif"],
            include: [
              {
                model: Prodi,
                as: "prodi",
                attributes: ["id", "name"],
              },
              {
                model: Role_user,
                as: "role",
                attributes: ["id", "name"],
              },
              {
                model: Fakultas,
                as: "fakultas",
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: Status,
            as: "status",
            attributes: ["status", "persetujuan"],
          },
        ],
        order: [["id", "ASC"]],
      })
    );
  } else if (role.name === "Dekan" || role.name === "Admin Dekan") {
    return res.send(
      await Daftar_surat.findAll({
        include: [
          {
            model: Tampilan,
            as: "tampilan",
            attributes: ["pin", "dibaca"],
          },
          {
            model: Users,
            as: "user",
            attributes: ["name", "email", "aktif"],
            include: [
              {
                model: Prodi,
                as: "prodi",
                attributes: ["id", "name"],
              },
              {
                model: Role_user,
                as: "role",
                attributes: ["id", "name"],
              },
              {
                model: Fakultas,
                as: "fakultas",
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: Status,
            as: "status",
            attributes: ["status", "persetujuan"],
          },
        ],
        where: {
          id: {
            [Op.in]: Sequelize.literal(`(
              SELECT "surat_id"
              FROM "Status"
              WHERE "persetujuan" IN ('disetujui TU', 'disetujui Dekan', 'ditolak Dekan')
            )`),
          },
        },
        order: [["id", "ASC"]],
      })
    );
  } else {
    //prodi
    const prodi = await Prodi.findOne({
      where: { id: user.prodi_id },
    });
    res.send(
      await Daftar_surat.findAll({
        include: [
          {
            model: Tampilan,
            as: "tampilan",
            attributes: ["id", "pin", "dibaca"],
          },
          {
            model: Users,
            as: "user",
            attributes: ["name", "email", "aktif"],
            where: { prodi_id: prodi.id },
            include: [
              {
                model: Prodi,
                as: "prodi",
                attributes: ["id", "name"],
              },
              {
                model: Role_user,
                as: "role",
                attributes: ["id", "name"],
              },
              {
                model: Fakultas,
                as: "fakultas",
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: Status,
            as: "status",
            attributes: ["status", "persetujuan"],
          },
        ],
      })
    );
  }
};

router.get("/", getDaftarSurat);

module.exports = {
  router,
  getDaftarSurat,
};
