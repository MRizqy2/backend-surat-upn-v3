"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Akses_surat extends Model {
    static associate(models) {
      Akses_surat.belongsTo(models.Daftar_surat, {
        foreignKey: "surat_id",
        as: "daftar_surat",
      });
      Akses_surat.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_id",
        as: "jabatan",
      });
    }
  }
  Akses_surat.init(
    {
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
      jabatan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Jabatan",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Akses_surat",
    }
  );
  return Akses_surat;
};
