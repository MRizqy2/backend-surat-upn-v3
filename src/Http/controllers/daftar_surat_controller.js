const express = require("express");
const app = express.Router();
const {
  Daftar_surat,
  Users,
  Role_user,
  Prodi,
  Fakultas,
  Status,
  Tampilan,
} = require("../../models");
const auth = require("../middleware/authMiddleware");
const cloudinaryController = require("../controllers/daftar_surat_controller/cloudinary_controller");
const { StatusCodes } = require("http-status-codes");
const getStatus = require("./daftar_surat_controller/status_controller");
const { Op, Sequelize } = require("sequelize");

app.use(express.json()); //
app.use(express.urlencoded({ extended: true }));

app
  .get("/", async function (req, res) {
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
  })

  .put("/persetujuan", async (req, res) => {
    try {
      const { status, persetujuan } = req.body;
      const { id } = req.query;
      const user = await Users.findOne({
        where: { id: req.token.id },
      });
      const role = await Role_user.findOne({
        where: { id: user.role_id },
      });

      const surat = await Daftar_surat.findOne({
        where: { id: id },
      });

      if (!surat) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "Daftar surat not found",
        });
      }

      const surat_per = await Daftar_surat.update(
        {
          persetujuan,
          status,
        },
        {
          where: { id: id },
          returning: true,
        }
      );

      res.status(StatusCodes.OK).json({ surat: surat_per });
    } catch (error) {
      console.error("Error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
      });
    }
  })

  .put("/status", async (req, res) => {
    const { id } = req.query;
    const { status, persetujuan } = req.body;
    let setStatus;
    const surat = Daftar_surat.findOne({
      where: { id },
    });

    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const role = await Role_user.findOne({
      where: { id: user.role_id }, //
    });

    if (persetujuan) {
      setStatus = getStatus(role.id, status, persetujuan);
    } else {
      setStatus = getStatus(role.id, status);
    }

    surat.status = setStatus;

    await surat.save();
  })

  .use(cloudinaryController);

module.exports = app;
