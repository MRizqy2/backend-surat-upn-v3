const express = require("express");
const router = express.Router();
const { REPO } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const postRepo = async (req, res) => {
  try {
    const { surat_id, indikator_id } = req.body;

    const latestRepo = await REPO.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });
    const latestRepoId = parseInt(latestRepo[0].id, 10);

    const timestamp = Date.now();
    const randomString = crypto.randomBytes(6).toString("hex");
    const unix_code = `${randomString}${timestamp}`
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    const repo = await REPO.create({
      id: latestRepoId + 1,
      surat_id,
      unix_code,
      indikator_id,
    });

    res.status(StatusCodes.OK).json({ message: `repo telah dibuat`, repo });
    // res.json( `repo telah dibuat`);
  } catch (error) {
    console.error("Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.post("/", postRepo);

module.exports = { postRepo, router };
// const suratFile = req.files["surat"][0];
//     const suratPath = `${suratFile.destination}`;
//     const judul = suratFile.filename;
//     let pathFile = path.join(suratPath, judul);
//     pathFile = pathFile.replaceAll(" ", "%20");
//     const user = await USERS.findOne({
//       where: { id: req.token.id },
//     });

//     const jabatan = await JABATAN.findOne({
//       where: { id: user.jabatan_id },
//     });

//     const jenis = await JENIS_SURAT.findOne({
//       where: { id: jenis_id },
//     });

//     const prodi = await PRODI.findOne({
//       where: { id: user.prodi_id },
//     });
//     const fakultas = await FAKULTAS.findOne({
//       where: { id: user.fakultas_id },
//     });

//     const folder = await FOLDER.findOne({
//       where: { id: folder_id },
//     });

//     // let data_user = `${user.id}/${user.name}/${jabatan.name}/${prodi.name}/${fakultas.name}`;
//     const data_user = JSON.stringify({
//       id: user.id,
//       name: user.name,
//       jabatan: jabatan.name,
//       prodi: prodi.name,
//       fakultas: fakultas.name,
//     });
//     const repo = await REPO.create({
//       judul,
//       nomor_surat,
//       jenis: jenis.jenis,
//       data_user: data_user,
//       tanggal: Date.now(),
//       path: pathFile,
//       folder_id: folder.id,
//     });
//     res.status(StatusCodes.OK).json({ message: `repo telah dibuat`, repo });
//     // res.json( `repo telah dibuat`);
//   } catch (error) {
//     console.error("Error:", error);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Internal Server Error" });
//   }
// };

// router.post(
//   "/",
//   // upload.fields([
//   //   { name: "surat", maxCount: 1 },
//   //   // { name: "thumbnail", maxCount: 1 },
//   // ]),
//   postRepo
// );

// module.exports = { postRepo, router };
