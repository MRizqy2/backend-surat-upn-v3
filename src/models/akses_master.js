"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Akses_master extends Model {
    static associate(models) {
      Akses_master.belongsTo(models.Permision, {
        as: "permision",
        foreignKey: "permision_id",
      });
    }
  }
  Akses_master.init(
    {
      permision_id: {
        type: DataTypes.INTEGER,
        allowNull: false, //sek tak coba flow surat
        references: {
          model: "Permision",
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
      modelName: "Akses_master",
    }
  );
  return Akses_master;
};
