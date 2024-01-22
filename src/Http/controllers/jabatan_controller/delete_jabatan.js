const express = require("express");
const {
  Jabatan,
  Akses_master,
  Permision,
  Users,
  Akses_surat,
} = require("../../../models");
const router = express.Router();

const deleteJabatan = async (req, res) => {
  try {
    const { jabatan_id } = req.query;

    if (!jabatan_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'jabatan_id' is required" });
    }
    const users = await Users.findAll({
      where: { jabatan_id: jabatan_id },
    });

    // Set jabatan_id to NULL for all associated Users
    for (let user of users) {
      user.jabatan_id = null;
      await user.save();
    }
    const akses_surat = await Akses_surat.findAll({
      where: { jabatan_id: jabatan_id },
    });
    for (let akseSurat of akses_surat) {
      akseSurat.jabatan_id = null;
      await akseSurat.save();
    }
    const permisions = await Permision.findAll({
      where: { jabatan_id: jabatan_id },
    });

    for (let permision of permisions) {
      await Akses_master.destroy({
        where: { permision_id: permision.id },
      });
    }

    await Permision.destroy({
      where: { jabatan_id: jabatan_id },
    });

    const deletedJabatan = await Jabatan.destroy({
      where: { id: jabatan_id },
    });

    if (deletedJabatan) {
      res.status(200).json({ message: "Jabatan deleted successfully" });
    } else {
      res.status(404).json({ error: "Jabatan not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteJabatan);

module.exports = {
  deleteJabatan,
  router,
};
