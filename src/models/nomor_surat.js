"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Nomor_surat extends Model {
    static associate(models) {
      Nomor_surat.belongsTo(models.Daftar_surat, {
        foreignKey: "surat_id",
        as: "daftar_surat",
      });
      Nomor_surat.belongsTo(models.Periode, {
        foreignKey: "periode_id",
        as: "periode",
      });
    }
  }
  Nomor_surat.init(
    {
      nomor_surat: DataTypes.STRING,
      surat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Daftar_surat",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      periode_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Periode",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Nomor_surat",
    }
  );
  return Nomor_surat;
};
