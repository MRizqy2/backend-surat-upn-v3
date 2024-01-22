const express = require("express");
const app = express.Router();
const {
  Status,
  Daftar_surat,
  Users,
  Jabatan,
  Permision,
} = require("../../../models");
const catchStatus = require("./catch_status");
const { StatusCodes } = require("http-status-codes");
const {
  postTampilan,
} = require("./../tampilan_surat_controller/post_tampilan");
const {
  postNomorSurat,
} = require("./../nomor_surat_controller/post_nomor_surat");
const { postNotif } = require("../notifikasi_controller/post_notifikasi");
const { post } = require("../jabatan_controller/jabatan_controller");
const {
  postAksesSurat,
} = require("../akses_surat_controller/post_akses_surat");

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
    console.log("[pp[lp]]");
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
          persetujuan: persetujuan,
          isSigned: req.body.isSigned,
        },
      };
    } else {
      reqStatus = {
        body: {
          jabatan_id: jabatan.id,
          isRead: req.body.dibaca,
          latestStatus: status_surat.status,
          persetujuan: persetujuan,
          // isSigned
        },
      };
    }
    console.log("  vmldv");
    const saveStatus = await catchStatus(reqStatus);
    console.log(" epmpovmmmm", saveStatus);

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
      console.log("vnrvmop");
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
      console.log("vn[ dwc");
    }
    console.log("sdawdawd", persetujuan);
    // const ON = 1;
    // if (ON === 1) {
    if (persetujuan && persetujuan.toLowerCase().includes("disetujui")) {
      //benerkan
      console.log("dawdawd", persetujuan);
      reqTampilan = {
        body: {
          surat_id: surat_id,
          from: "status_surat_controller",
        },
        token: req.token,
      };
      if (jabatan.jabatan_atas_id) {
        await postTampilan(reqTampilan);
        reqAkses = {
          body: {
            surat_id: surat.id,
            tambah_akses_id: jabatan.jabatan_atas_id || "",
            from: `status_surat_controller/put_status.js`,
          },
        };
        await postAksesSurat(reqAkses);
        const reqNotif = {
          body: {
            surat_id: surat_id,
            jabatan_id_dari: jabatan.id,
            jabatan_id_ke: jabatan.jabatan_atas_id,
            from: `status_surat_controller/put_status`,
          },
        };
        await postNotif(reqNotif);
      } //

      const permision = await Permision.findOne({
        where: { jabatan_id: jabatan.id },
      });
      if (permision.generate_nomor_surat) {
        // const save_surat = await Daftar_surat.create({
        //   judul: surat.judul,
        //   thumbnail: surat.thumbnail || "",
        //   jenis_id: surat.jenis_id || "",
        //   user_id: surat.user_id,
        //   deskripsi: surat.deskripsi || "",
        //   tanggal: surat.tanggal,
        //   url: surat.url,
        // });
        await postNomorSurat(reqTampilan);
      } //surat_id
    }
    if (persetujuan && persetujuan.toLowerCase().includes("ditolak")) {
      const user_surat = await Users.findOne({
        where: { id: surat.user_id },
      });
      const reqNotif = {
        body: {
          surat_id: surat_id,
          jabatan_id_dari: jabatan.id,
          jabatan_id_ke: user_surat.jabatan_id,
          from: `status_surat_controller/put_status`,
        },
      };
      await postNotif(reqNotif);
    }

    if (req.body.from) {
      return updateStatus;
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
