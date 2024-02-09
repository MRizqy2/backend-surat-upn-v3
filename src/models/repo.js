"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class REPO extends Model {
    static associate(models) {
      REPO.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id",
        as: "surat",
      });
      REPO.belongsTo(models.INDIKATOR, {
        foreignKey: "indikator_id",
        as: "indikator",
      }),
        REPO.belongsTo(models.IKU, {
          foreignKey: "iku_id",
          as: "iku",
        });
      REPO.belongsTo(models.STRATEGI, {
        foreignKey: "strategi_id",
        as: "strategi",
      });
    }
  }
  REPO.init(
    {
      surat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
      },
      kode_url: DataTypes.STRING,
      strategi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "STRATEGI",
          key: "id",
        },
      },
      iku_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "IKU",
          key: "id",
        },
      },
      indikator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "INDIKATOR",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "REPO",
      tableName: "REPOS",
    }
  );
  return REPO;
};
