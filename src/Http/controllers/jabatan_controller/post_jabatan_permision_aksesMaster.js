const express = require("express");
const { Jabatan, Permision, Akses_master } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const { postPermision } = require("../permision_controller/post_permision");
const {
  postAksesMaster,
} = require("../akses_master_controller/post_akses_master");
const { getJabatan } = require("./get_jabatan");
const router = express.Router();

const postJabatanPermisionAksesMaster =
  (isAdmin,
  async (req, res) => {
    const {
      name,
      jabatan_atas_id,
      jabatan_bawah_id,
      //req permision
      buat_surat,
      download_surat,
      generate_nomor_surat,
      upload_tandatangan,
      persetujuan,
      // req akses master
      prodi,
      template,
      periode,
      fakultas,
      jabatan,
      jenis_surat,
    } = req.body;
    try {
      // const latestJabatan = await Jabatan.findAll({
      //   limit: 1,
      //   order: [["id", "DESC"]],
      // });

      // const latestJabatanId = parseInt(latestJabatan[0].id, 10);

      const saveJabatan = await Jabatan.create({
        // id: latestJabatanId + 1,
        name,
        jabatan_atas_id: jabatan_atas_id || null,
        jabatan_bawah_id: jabatan_bawah_id || null,
      });

      const reqPermision = {
        body: {
          jabatan_id: saveJabatan.id,
          buat_surat,
          download_surat,
          generate_nomor_surat,
          upload_tandatangan,
          persetujuan,
        },
      };
      // const savePermision = await postPermision(reqPermision);

      const reqAksesMaster = {
        body: {
          permision_id: savePermision.id,
          prodi,
          template,
          periode,
          fakultas,
          jabatan,
          jenis_surat,
        },
      };
      // const saveAksesMaster = await postAksesMaster(reqAksesMaster);

      const reqJabatan = {
        query: {
          jabatan_id: saveJabatan.id,
        },
      };

      async function createPermision(data) {
        const permision = await Permision.create(data);
        return permision;
      }

      // Utility function to create an AksesMaster
      async function createAksesMaster(data) {
        const aksesMaster = await Akses_master.create(data);
        return aksesMaster;
      }

      // Then in your controller function
      const savePermision = await createPermision(reqPermision.body);
      const saveAksesMaster = await createAksesMaster(reqAksesMaster.body);

      res.status(StatusCodes.CREATED).json({
        message: `${await getJabatan(reqJabatan)} created successfully`,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  });

router.post("/", postJabatanPermisionAksesMaster, isAdmin);

module.exports = {
  postJabatanPermisionAksesMaster,
  router,
};
