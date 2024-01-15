const express = require("express");
const app = express.Router();
const router = express.Router();
const { Status, Daftar_surat, Users, Role_user } = require("../../../models");
const getStatus = require("./status_controller");
const { StatusCodes } = require("http-status-codes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

router.post("/awal", postStatus);

module.exports = {
  router,
  postStatus,
  app,
};
