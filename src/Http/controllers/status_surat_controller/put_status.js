const express = require("express");
const app = express.Router();
const {
  Status,
  Daftar_surat,
  Users,
  Jabatan,
  Permision,
} = require("../../../models");
const getStatus = require("./status_controller");
const { StatusCodes } = require("http-status-codes");
const {
  postTampilan,
} = require("./../tampilan_surat_controller/post_tampilan");
const {
  postNomorSurat,
} = require("./../nomor_surat_controller/post_nomor_surat");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const putStatus = async (req, res) => {
  try {
    let reqTampilan, updateStatus, reqStatus;
    const { persetujuan, status } = req.body;
    const { surat_id } = req.query;

    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await Jabatan.findOne({
      where: { id: user.jabatan_id },
    });

    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });
    console.log("krvpom", surat.id);
    const status_surat = await Status.findOne({
      where: { surat_id: surat.id },
    });

    if (!status_surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Status not found",
      });
    }

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }

    if (req.body.from) {
      //diproses/dibaca
      reqStatus = {
        body: {
          jabatan_id: user.jabatan_id,
          isRead: req.body.dibaca,
          latestStatus: status_surat.status,
          persetujuan: persetujuan, //iki admin dekan null berarti?
          isSigned: req.body.isSigned,
        },
      };
    } else {
      reqStatus = {
        body: {
          jabatan_id: jabatan.jabatan_atas_id,
          isRead: req.body.dibaca,
          latestStatus: status_surat.status,
          persetujuan: persetujuan,
          // isSigned
        },
      };
    }
    const saveStatus = await getStatus(reqStatus);
    console.log(" epmpovm", saveStatus);

    if (!persetujuan) {
      updateStatus = await Status.update(
        {
          // persetujuan: persetujuan || status_surat.persetujuan || "",
          status: saveStatus || status || status_surat.status,
        },
        {
          where: { surat_id: surat.id ? surat.id : surat_id },
          returning: true,
        }
      );
    } else {
      updateStatus = await Status.update(
        {
          persetujuan: persetujuan || status_surat.persetujuan || "",
          status: saveStatus || status || status_surat.status,
        },
        {
          where: { surat_id: surat.id ? surat.id : surat_id },
          returning: true,
        }
      );
    }
    console.log("sdawdawd", persetujuan);
    // const ON = 1;
    // if (ON === 1) {
    if (persetujuan) {
      //benerkan
      console.log("dawdawd", persetujuan);
      reqTampilan = {
        body: {
          surat_id: surat_id,
          from: "status_surat_controller",
        },
        token: req.token,
      };
      await postTampilan(reqTampilan);

      const permision = await Permision.findOne({
        where: { jabatan_id: jabatan.id },
      });
      if (permision.persetujuan) {
        await postNomorSurat(reqTampilan);
      } //surat_id
    }

    if (req.body.from) {
      //
      return updateStatus; //
    } else {
      res.status(StatusCodes.OK).json({ surat: updateStatus });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

app.put("/update", putStatus);

module.exports = {
  putStatus,
  app,
};
