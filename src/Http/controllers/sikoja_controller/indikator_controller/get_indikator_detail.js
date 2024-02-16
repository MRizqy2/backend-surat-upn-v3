const { INDIKATOR, STRATEGI, IKU } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const express = require("express");
const router = express.Router();

// const getIndikator = async (req, res) => {
//   try {
//     const { indikator_id } = req.query;

//     if (!indikator_id) {
//       // Mendapatkan semua data
//       const allData = await INDIKATOR.findAll({ order: [["id", "ASC"]] });
//       res.send(allData);
//     } else if (indikator_id) {
//       // Mendapatkan data berdasarkan ID
//       const findOneData = await INDIKATOR.findOne({
//         where: { id: indikator_id },
//       });

//       if (findOneData) {
//         res.send(findOneData);
//       } else {
//         res.status(StatusCodes.NOT_FOUND).json({ error: "Data not found" });
//       }
//     } else {
//       res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid parameters" });
//     }
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message });
//   }
// };

// router.get("/", getIndikator);

// module.exports = { router, getIndikator };

const getIndikatorDetail = async (req, res) => {
  try {
    const { indikator_id } = req.query;

    const whereClause = {};
    if (req.query && indikator_id) {
      whereClause.id = indikator_id;
    }
    const indikator = await INDIKATOR.findOne({
      where: whereClause,
      attributes: { exclude: ["iku_id", "strategi_id"] },
      include: [
        {
          model: STRATEGI,
          as: "strategi",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: IKU,
          as: "iku",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    return res.json({ indikator });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/", getIndikatorDetail);

module.exports = { getIndikatorDetail, router };
