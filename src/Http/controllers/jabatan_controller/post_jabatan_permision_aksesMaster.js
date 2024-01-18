const express = require("express");
const { Jabatan, Permision, Akses_master } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { postPermision } = require("../permision_controller/post_permision");
const {
  postAksesMaster,
} = require("../akses_master_controller/post_akses_master");
const { getJabatan } = require("./get_jabatan");
const router = express.Router();

const postJabatanPermisionAksesMaster = async (req, res) => {
  const {
    name,
    jabatan_atas_id,
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
    });

    // const checkJabatanAtas = await Jabatan.findAll({
    //   where: { id: saveJabatan.jabatan_atas_id },
    // });
    // if (checkJabatanAtas[0].jabatan_bawah_id != saveJabatan.jabatan_atas_id) {
    //   await Jabatan.update(
    //     {
    //       jabatan_bawah_id: saveJabatan.jabatan_atas_id,
    //     },
    //     {
    //       where: {
    //         id: checkJabatanAtas[0].id,
    //       },
    //     }
    //   );
    // }

    const reqPermision = {
      body: {
        from: `jabatan_controller/post_jabatan_permision_aksesMaster`,
        jabatan_id: saveJabatan.id,
        buat_surat,
        download_surat,
        generate_nomor_surat,
        upload_tandatangan,
        persetujuan,
      },
    };
    const savePermision = await postPermision(reqPermision);

    const reqAksesMaster = {
      body: {
        from: `jabatan_controller/post_jabatan_permision_aksesMaster`,
        permision_id: savePermision.id,
        prodi,
        template,
        periode,
        fakultas,
        jabatan,
        jenis_surat,
      },
    };
    const saveAksesMaster = await postAksesMaster(reqAksesMaster);

    const reqJabatan = {
      query: {
        from: `jabatan_controller/post_jabatan_permision_aksesMaster`,
        jabatan_id: saveJabatan.id,
      },
    };
    const getDataJabatan = await getJabatan(reqJabatan);

    res.status(StatusCodes.CREATED).json({
      message: " created successfully",
      getDataJabatan,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postJabatanPermisionAksesMaster);

module.exports = {
  postJabatanPermisionAksesMaster,
  router,
};
