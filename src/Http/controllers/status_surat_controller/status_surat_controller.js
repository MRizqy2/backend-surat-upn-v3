const express = require("express");
const app = express.Router();
const router = express.Router();
const { Status, Daftar_surat, Users, Role_user } = require("../../../models");
const getStatus = require("./status_controller");
const { StatusCodes } = require("http-status-codes");
const {
  postTampilan,
} = require("../tampilan_surat_controller/tampilan_surat_controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//   .post("/awal", async (req, res) => {
const postStatus = async (req, res) => {
  try {
    if (req.body) {
      const { surat_id } = req.body;
    }
    const surat = await Daftar_surat.findOne({
      where: { id: req.save.surat_id || surat_id },
    });
    const user = await Users.findOne({
      where: { id: req.save.user_id || req.token.id },
    });

    const role = await Role_user.findOne({
      where: { id: user.role_id },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }

    const status = getStatus(role.id, false, null, null);
    console.log("asdnvni", status);
    // const statusString = status.join(", ");
    // console.log("dwadawdaw", statusString);
    const surat_kesetujuan = await Status.create({
      surat_id: surat.id,
      persetujuan: "",
      status: status,
    });

    if (!req.save.from) {
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
    // console.log("asdawd", surat_id);
    // console.log("btrbr", req.save.surat_id);
    const user = await Users.findOne({
      where: { id: req.token.id },
    });

    if (!req.body) {
      surat = await Daftar_surat.findOne({
        where: { id: req.save.surat_id },
      });
    } else {
      surat = await Daftar_surat.findOne({
        where: { id: surat_id },
      });
    }
    const status_surat = await Status.findOne({
      where: { surat_id: surat.id },
    });

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

    const surat_per = await Status.update(
      {
        persetujuan: status_surat.persetujuan || persetujuan || "",
        status: isiStatus || status || status_surat.status,
      },
      {
        where: { surat_id: surat.id ? surat.id : surat_id },
        returning: true,
      }
    );

    if (persetujuan === "Disetujui TU") {
      reqTampilan = {
        save: {
          surat_id: surat_id,
          // dibaca: dibaca,
          user_id: user.id,
          from: "status_surat_controller",
        },
      };
      const saveTampilan = await postTampilan(reqTampilan);
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

router.post("/awal", postStatus);
router.put("/update", putStatus);

module.exports = {
  router,
  putStatus,
  postStatus,
  app,
};
