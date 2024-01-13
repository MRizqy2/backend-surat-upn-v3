const express = require("express");
const app = express.Router();
const router = express.Router();
const { Status, Daftar_surat, Users, Role_user } = require("../../models");
const getStatus = require("../controllers/daftar_surat_controller/status_controller");
const { StatusCodes } = require("http-status-codes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (req, res) {
  const user = await Users.findOne({
    where: { id: req.token.id },
  });
  const role = await Role_user.findOne({
    where: { id: user.role_id },
  });

  if (role.id !== 2) {
    //TU
    if (role.id === 4 && role.id === 5) {
      //dekan && admin dekan
      return res.send(
        await Daftar_surat.findAll({
          where: {
            status: {
              [Op.or]: ["disetujui TU", "disetujui Dekan", "ditolak Dekan"],
            },
          },
          include: [
            {
              model: Users,
              as: "user",
              attributes: ["name", "email", "aktif"],
              include: [
                {
                  model: Prodi,
                  as: "prodi",
                  attributes: ["id", "name"],
                },
                {
                  model: Role_user,
                  as: "role",
                  attributes: ["id", "name"],
                },
                {
                  model: Fakultas,
                  as: "fakultas",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
          order: [["id", "ASC"]],
        })
      );
    }
    res.send(
      //get all
      await Daftar_surat.findAll({
        include: [
          {
            model: Users, // nek get all e daftar surat okeeh sek
            // include: [
            //     {
            //       model: Status,
            //       as: 'status', // asumsikan 'status' adalah nama relasi yang Anda definisikan di model
            //     },
            //   ],
            as: "user",
            attributes: ["name", "email", "aktif"],
            include: [
              {
                model: Prodi,
                as: "prodi",
                attributes: ["id", "name"],
              },
              {
                model: Role_user,
                as: "role",
                attributes: ["id", "name"],
              },
              {
                model: Fakultas,
                as: "fakultas",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
      })
    );
  } else {
    //prodi
    const prodi = await Prodi.findOne({
      where: { id: user.prodi_id },
    });
    res.send(
      await Daftar_surat.findAll({
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["name", "email", "aktif"],
            where: { prodi_id: prodi.id },
            include: [
              {
                model: Prodi,
                as: "prodi",
                attributes: ["id", "name"],
              },
              {
                model: Role_user,
                as: "role",
                attributes: ["id", "name"],
              },
              {
                model: Fakultas,
                as: "fakultas",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      })
    );
  }
});
//   .post("/awal", async (req, res) => {
const postStatus = async (req, res) => {
  try {
    if (req.body) {
      const { surat_id } = req.body;
    }
    // const { id } = req.query;
    // console.log("testing ", req.user.id);
    // const user = await Users.findOne({
    //   where: { id: req.user.id },
    // });
    // console.log("testing ", req.save.surat_id); //Error: ReferenceError: role is not defined
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

    const status = getStatus(role.id, false, null);
    // console.log("testing ", status);
    const statusString = status.join(", "); // Convert array to string//aman tp log eror njir/ ha/ opoe
    // console.log("testing ", statusString); // INSERT INTO "Statuses"
    const surat_kesetujuan = await Status.create({
      // error client
      surat_id: surat.id,
      persetujuan: "",
      status: statusString,
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
app.put("/update", async (req, res) => {
  try {
    const { persetujuan, status } = req.body;
    const { id } = req.query;
    const user = await Users.findOne({
      where: { id: req.token.id },
    });

    const surat = await Daftar_surat.findOne({
      where: { id: user.surat_id },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }
    // const statusArray = getStatus(role.id, true, persetujuan);
    // const status = statusArray.join(", ");
    const surat_per = await Daftar_surat.update(
      {
        persetujuan,
        status: status,
      },
      {
        where: { id: id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ surat: surat_per });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
});

router.post("/awal", postStatus);

module.exports = {
  router,
  postStatus, // export this function so it can be used elsewhere
  app,
};
