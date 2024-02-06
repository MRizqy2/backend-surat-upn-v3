const express = require("express");
const router = express.Router();
const { SIKOJA } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destination = `sikoja/`;
    cb(null, destination);
  },

  filename: function (req, file, cb) {
    const judul = file.originalname || "default";
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}-${judul}`;
    cb(null, filename);
  },
});

const updateSikoja = async (req, res) => {
  try {
    let judul;
    const { sikoja_id } = req.query;
    const { nomor_surat, url } = req.body;
    if (req.files["surat"][0]) {
      const suratFile = req.files["surat"][0];
      judul = suratFile.filename;
    }
    const sikoja = await SIKOJA.update(
      { judul, nomor_surat, url },
      { where: { id: sikoja_id }, returning: true }
    );

    if (sikoja) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Sikoja update successfully", sikoja });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Sikoja not found" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

router.put("/", upload.fields([{ name: "surat", maxCount: 1 }]), updateSikoja);

module.exports = {
  updateSikoja,
  router,
};
