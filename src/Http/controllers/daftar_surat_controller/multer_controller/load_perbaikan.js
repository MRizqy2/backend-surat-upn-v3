const express = require("express");
const router = express.Router();
const { REVISI, PERBAIKAN, DAFTAR_SURAT } = require("../../../../models");

const loadPerbaikan = async (req, res) => {
  try {
    const { surat_id } = req.body;
    let surat;
    const saveSurat = [];
    const savePerbaikan = [];
    let isOldSurat = false;

    // Load REVISI records
    do {
      surat = await REVISI.findAll({
        where: {
          surat_id_baru: isOldSurat ? surat[0]?.surat_id_old?.id : surat_id,
        },
        include: [
          {
            model: DAFTAR_SURAT,
            as: "surat_id_old",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
      if (surat[0]) {
        saveSurat.push(surat[0].surat_id_baru);
      }
      isOldSurat = true;
    } while (surat[0]);

    // Load PERBAIKAN records
    for (let j = 0; j < saveSurat.length; j++) {
      const perbaikanSurat = await PERBAIKAN.findAll({
        where: { surat_id: saveSurat[j] },
      });
      if (perbaikanSurat[0]) {
        savePerbaikan.push(perbaikanSurat[0]);
      }
    }

    return savePerbaikan;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while loading perbaikan." });
  }
};

router.get("/", loadPerbaikan);

module.exports = {
  router,
  loadPerbaikan,
};

//======================================

// const express = require("express");
// const router = express.Router();
// const { REVISI, PERBAIKAN, DAFTAR_SURAT } = require("../../../../models");

// const loadPerbaikan = async (req, res) => {
//   const { surat_id } = req.body;
//   let surat,
//     save_surat = [],
//     i = 0,
//     j = 0,
//     save_perbaikan = [],
//     bool = false;

//   //   save_surat[0] = surat_id;
//   do {
//     surat = await REVISI.findAll({
//       where: { surat_id_baru: bool ? surat[0].surat_id_old.id : surat_id },
//       include: [
//         {
//           model: DAFTAR_SURAT,
//           as: "surat_id_old",
//           attributes: { exclude: ["createdAt", "updatedAt"] },
//         },
//       ],
//     });
//     bool = true;
//     // surat = JSON.stringify(surat);
//     console.log("iqpnef", surat);
//     if (surat[0] && surat) {
//       save_surat[i] = surat[0].surat_id_baru;
//       console.log("pkwkvempe ", save_surat[i], "i = ", i);
//       i++;
//     }
//   } while (surat[0]);

//   console.log("nkipe", save_surat);

//   do {
//     if (save_surat[j]) {
//       surat = await PERBAIKAN.findAll({
//         where: { surat_id: save_surat[j] },
//       });
//     }
//     console.log("prkbm", surat);
//     save_perbaikan[j] = surat[0];
//     j++;
//   } while (j < i);

//   res.json({ save_perbaikan });
// };

// router.get("/", loadPerbaikan);

// module.exports = {
//   router,
//   loadPerbaikan,
// };
