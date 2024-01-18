const express = require("express");
const app = express.Router();
const router = express.Router();
const { Tampilan, Daftar_surat, Users, Role_user } = require("../../../models");
const { putStatus } = require("../status_surat_controller/put_status");
const { StatusCodes } = require("http-status-codes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const putTampilan = async (req, res) => {
  try {
    const { pin, dibaca } = req.body;
    const { surat_id } = req.query;
    // console.log("testing ", req.token.id); //testing  4
    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const tampilan = await Tampilan.update(
      {
        pin: pin,
        dibaca: dibaca,
      },
      {
        where: {
          surat_id: surat_id,
          jabatan_id: user.jabatan_id,
        },
        returning: true,
      }
    );

    let saveStatus;
    if (dibaca) {
      const reqStatus = {
        save: {
          surat_id: surat_id,
          dibaca: dibaca,
          user: user,
          from: "tampilan_surat_controller",
        },
        token: req.token,
      };
      saveStatus = await putStatus(reqStatus, null);
    }

    res.status(StatusCodes.OK).json({ tampilan, saveStatus });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.put("/update", putTampilan);

module.exports = {
  router,
  putTampilan,
  app,
};
