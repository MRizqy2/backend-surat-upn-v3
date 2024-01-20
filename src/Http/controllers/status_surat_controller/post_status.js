const express = require("express");
const app = express.Router();
const router = express.Router();
const { Status, Daftar_surat, Users, Jabatan } = require("../../../models");
const getStatus = require("./status_controller");
const { StatusCodes } = require("http-status-codes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postStatus = async (req, res) => {
  try {
    const { surat_id } = req.body;
    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });

    const user = await Users.findOne({
      where: { id: req.body.user_id || req.token.id },
    });

    const jabatan = await Jabatan.findOne({
      where: { id: user.jabatan_id },
    });
    // const jabatan_atas = await Jabatan.findOne({
    //   where: { id: jabatan.jabatan_atas_id },
    // });
    // console.log("sdadwdaw", jabatan_atas.id); //kok 2/ iyo/ malah kosong/ statusse kosong
    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        //iki wes 3
        error: "Daftar surat not found",
      });
    }

    const reqStatus = {
      body: {
        jabatan_id: jabatan.id, //"status": "Di Daftar Tunggu prodi", kan harusse TU
        isRead: false, //
        latestStatus: "",
        persetujuan: "",
        isSigned: false,
      },
    }; //asdnvni Promise { <pending> }

    const saveStatus = await getStatus(reqStatus);
    console.log("uiio;", saveStatus);

    const surat_kesetujuan = await Status.create({
      surat_id: surat.id,
      persetujuan: "",
      status: saveStatus,
    });

    if (!req.body.from) {
      res.status(StatusCodes.OK).json({ surat: surat_kesetujuan });
    } else {
      return { surat_kesetujuan };
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.post("/awal", postStatus);

module.exports = {
  router,
  postStatus,
  app,
};
