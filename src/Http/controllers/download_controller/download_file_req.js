const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const {
  DAFTAR_SURAT,
  USERS,
  JABATAN,
  PERMISION,
  STATUS,
} = require("../../../models");
const { putStatus } = require("../status_surat_controller/put_status");

const handleFileRequest = async (req, res) => {
  try {
    let user = req.token.id;
    let { filepath } = req.query;
    console.log("filepath: ", filepath);

    user = await USERS.findOne({ where: { id: user } });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });
    const permision = await PERMISION.findOne({
      where: { jabatan_id: jabatan.id },
    });

    if (permision.upload_tandatangan) {
      const surat = await DAFTAR_SURAT.findOne({
        where: { path: filepath },
      });
      const status_surat = await STATUS.findOne({
        where: { surat_id: surat.id },
      });

      const statusJ = status_surat.status.toLowerCase();

      console.log("posisi 1 ", status_surat.status);
      const statusS = status_surat.status.toLowerCase();
      console.log("posisi 2 ", statusJ, statusS);

      if (
        statusJ.includes(`${jabatan.name.toLowerCase()}`) &&
        !statusS.includes(`bsre`)
      ) {
        console.log("masuk");
        const reqStatus = {
          body: {
            user: user,
            from: "download_controller",
          },
          query: {
            surat_id: surat.id,
          },
          token: {
            id: req.token.id,
          },
        };

        await putStatus(reqStatus);
      }
    }

    filepath = decodeURIComponent(filepath);

    filepath = path.resolve(__dirname, "../../../../", filepath);
    filepath = filepath.replace(/\\/g, "/");
    if (!fs.existsSync(filepath)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "File not found" });
    }
    // res.setHeader("Content-Disposition", `attachment; filename="123"`);

    res.download(filepath, (err) => {
      if (err) {
        console.error("Error:", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    });
    // const buffer = fs.readFileSync(filepath);
    // res.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", handleFileRequest);

module.exports = { router, handleFileRequest };
