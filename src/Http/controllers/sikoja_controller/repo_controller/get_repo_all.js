const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const {
  REPO,
  DAFTAR_SURAT,
  STATUS,
  USERS,
  KOMENTAR,
  NOMOR_SURAT,
  PERIODE,
  TAMPILAN,
  JENIS_SURAT,
  JABATAN,
  // AKSES_SURAT,
  PRODI,
  FAKULTAS,
  INDIKATOR,
  STRATEGI,
  IKU,
} = require("../../../../models");
const catchStatus = require("../../status_surat_controller/catch_status");

const getRepo = async (req, res) => {
  try {
    //data tunggal
    const { startDate, endDate } = req.query;
    const { id } = req.token;
    console.log("id", id);

    //data array
    const { prodi_id, strategi_id, indikator_id, iku_id } = req.body;
    console.log("prodi_id", prodi_id);
    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter[Op.lte] = end;
    }

    const user = await USERS.findOne({
      where: { id },
    });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });
    const prodi = await PRODI.findOne({
      where: { id: user.prodi_id },
    });

    const whereClause = {};
    if (req.query && startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }
    if (prodi_id && prodi_id.length > 0) {
      whereClause["$surat.user.prodi.id$"] = {
        [Op.in]: prodi_id,
      };
    }
    if (strategi_id && strategi_id.length > 0) {
      whereClause["$indikator.strategi.id$"] = {
        [Op.in]: strategi_id,
      };
    }
    if (indikator_id && indikator_id.length > 0) {
      whereClause.indikator_id = {
        [Op.in]: indikator_id,
      };
    }
    if (iku_id && iku_id.length > 0) {
      whereClause["$indikator.iku.id$"] = {
        [Op.in]: iku_id,
      };
    }

    console.log("whereClause", whereClause);
    const repo = await REPO.findAll({
      where: { ...whereClause, visible: true },
      order: [["id", "ASC"]],
      attributes: { exclude: ["indikator_id", "surat_id"] },
      include: [
        {
          model: INDIKATOR,
          as: "indikator",
          attributes: {
            exclude: ["iku_id", "strategi_id", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: STRATEGI,
              as: "strategi",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: IKU,
              as: "iku",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: DAFTAR_SURAT,
          as: "surat",
          attributes: { exclude: [, "createdAt", "updatedAt"] },
          order: [["id", "ASC"]],
          // where: {
          //   ...whereClause,
          // },
          include: [
            {
              model: STATUS,
              as: "status",
              attributes: ["status", "persetujuan"],
            },
            {
              model: TAMPILAN,
              as: "tampilan",
              attributes: ["pin", "dibaca"],
              where: { jabatan_id: jabatan.id },
            },
            {
              model: JENIS_SURAT,
              as: "jenis",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: KOMENTAR,
              as: "komentar",
              attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
            },
            {
              model: NOMOR_SURAT,
              as: "nomor_surat",
              attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
              include: [
                {
                  model: PERIODE,
                  as: "periode",
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                },
              ],
            },
            {
              model: USERS,
              as: "user",
              attributes: ["email", "name"],
              include: [
                {
                  model: PRODI,
                  as: "prodi",
                  attributes: ["id", "name"],
                },
                {
                  model: JABATAN,
                  as: "jabatan",
                  attributes: ["id", "name"],
                },
                {
                  model: FAKULTAS,
                  as: "fakultas",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json({ repo });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/", getRepo);

module.exports = { getRepo, router };

// const getRepo = async (req, res) => {
//   try {
//     const { surat_id } = req.query;

//     const user = await USERS.findOne({
//       where: { id: req.token.id },
//     });
//     const jabatan = await JABATAN.findOne({
//       where: { id: user.jabatan_id },
//     });
//     const prodi = await PRODI.findOne({
//       where: { id: user.prodi_id },
//     });

//     const whereClause = {};
//     if (req.query && surat_id) {
//       whereClause.surat_id = surat_id;
//     }

//     const reqStatus = {
//       body: {
//         isSigned: true,
//       },
//     };
//     // const status = await catchStatus(reqStatus);

//     const repo = await REPO.findAll({
//       where: whereClause,
//       order: [["id", "ASC"]],
//       include: [
//         {
//           model: DAFTAR_SURAT,
//           as: "surat",
//           attributes: { exclude: [, "createdAt", "updatedAt"] },
//           order: [["id", "ASC"]],
//           where: {
//             // "$surat.status.status$": status,
//             ...whereClause,
//           },
//           include: [
//             {
//               model: STATUS,
//               as: "status",
//               attributes: ["status", "persetujuan"],
//             },
//             {
//               model: TAMPILAN,
//               as: "tampilan",
//               attributes: ["pin", "dibaca"],
//               where: { jabatan_id: jabatan.id },
//             },
//             {
//               model: JENIS_SURAT,
//               as: "jenis",
//               attributes: { exclude: ["createdAt", "updatedAt"] },
//             },
//             // {
//             //   model: AKSES_SURAT,
//             //   as: "akses_surat",
//             //   attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
//             //   where: { jabatan_id: user.jabatan_id },
//             // },
//             {
//               model: KOMENTAR,
//               as: "komentar",
//               attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
//             },
//             {
//               model: NOMOR_SURAT,
//               as: "nomor_surat",
//               attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
//               include: [
//                 {
//                   model: PERIODE,
//                   as: "periode",
//                   attributes: { exclude: ["createdAt", "updatedAt"] },
//                 },
//               ],
//             },
//             {
//               model: USERS,
//               as: "user",
//               attributes: ["email", "name"],
//               include: [
//                 {
//                   model: PRODI,
//                   as: "prodi",
//                   attributes: ["id", "name"],
//                   // where: { id: prodi.id },
//                 },
//                 {
//                   model: JABATAN,
//                   as: "jabatan",
//                   attributes: ["id", "name"],
//                   // where: { id: jabatan.id },
//                 },
//                 {
//                   model: FAKULTAS,
//                   as: "fakultas",
//                   attributes: ["id", "name"],
//                   // where: { id: fakultas.id },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     return res.status(StatusCodes.OK).json({ repo });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
//   }
// };
// router.get("/", getRepo);

// module.exports = { getRepo, router };
