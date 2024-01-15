const express = require("express");
const app = express.Router();
const { Status, Daftar_surat, Users, Role_user } = require("../../../models");
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
    let persetujuan,
      status = "",
      surat_id,
      reqTampilan;
    let surat, isiStatus;
    if (req.body) {
      ({ persetujuan, status } = req.body);
      ({ surat_id } = req.query);
    }
    console.log("asdawd");
    // console.log("btrbr", req.save.surat_id);
    const user = await Users.findOne({
      where: { id: req.token.id },
    });

    if (!req.body) {
      surat = await Daftar_surat.findOne({
        where: { id: req.save.surat_id }, //tampilan
      });
    } else {
      surat = await Daftar_surat.findOne({
        where: { id: surat_id },
      });
    }
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

    if (!req.body) {
      isiStatus = getStatus(
        req.save.user.role_id,
        req.save.dibaca,
        status_surat.status
      );
    } else {
      isiStatus = getStatus(
        user.role_id,
        true,
        status_surat.status,
        persetujuan
      );
    }
    if (isiStatus.length == 0) {
      isiStatus = null;
    }
    // console.log("nkpkm ", persetujuan);

    const surat_per = await Status.update(
      {
        persetujuan: persetujuan || status_surat.persetujuan || "",
        status: isiStatus || status || status_surat.status,
      },
      {
        where: { surat_id: surat.id ? surat.id : surat_id },
        returning: true,
      }
    );
    console.log("sdawdawd", persetujuan);
    if (persetujuan === `Disetujui TU` || persetujuan === `Disetujui Dekan`) {
      console.log("dawdawd", persetujuan);
      reqTampilan = {
        save: {
          surat_id: surat_id,
          // dibaca: dibaca,
          user_id: user.id,
          from: "status_surat_controller",
        },
        token: { id: req.token.id },
      };
      const saveTampilan = await postTampilan(reqTampilan);
      if (persetujuan === `Disetujui Dekan`) {
        await postNomorSurat(reqTampilan);
      } //surat_id
    }

    if (!req.body) {
      return surat_per;
    } else {
      res.status(StatusCodes.OK).json({ surat: surat_per });
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
