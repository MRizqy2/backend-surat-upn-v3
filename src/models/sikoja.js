"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SIKOJA extends Model {
    static associate(models) {
      SIKOJA.belongsTo(models.INDIKATOR, {
        foreignKey: "indikator_id",
        as: "indikator",
      });
    }
  }
  SIKOJA.init(
    {
      judul: DataTypes.STRING,
      nomor_surat: DataTypes.STRING,
      url: DataTypes.STRING,
      indikator_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "INDIKATOR",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "SIKOJA",
      tableName: "SIKOJAS",
    }
  );
  return SIKOJA;
};
