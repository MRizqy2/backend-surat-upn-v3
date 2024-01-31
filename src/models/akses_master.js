"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AKSES_MASTER extends Model {
    static associate(models) {
      AKSES_MASTER.belongsTo(models.PERMISION, {
        as: "permision",
        foreignKey: "permision_id",
      });
    }
  }
  AKSES_MASTER.init(
    {
      permision_id: {
        type: DataTypes.INTEGER,
        allowNull: false, //sek tak coba flow surat
        references: {
          model: "PERMISION",
          key: "id",
        },
      }, // wokeeh
      prodi: DataTypes.BOOLEAN,
      template: DataTypes.BOOLEAN,
      periode: DataTypes.BOOLEAN,
      fakultas: DataTypes.BOOLEAN,
      jabatan: DataTypes.BOOLEAN,
      jenis_surat: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "AKSES_MASTER",
    }
  );
  return AKSES_MASTER;
};
