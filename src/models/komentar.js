"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Komentar extends Model {
    static associate(models) {
      Komentar.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_id_ke",
        as: "jabatan_ke",
      });
      Komentar.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_id_dari",
        as: "jabatan_dari",
      });
      Komentar.belongsTo(models.Daftar_surat, {
        foreignKey: "surat_id",
        as: "daftar_surat",
      });
    }
  }
  Komentar.init(
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
      jabatan_id_ke: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Jabatan",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      jabatan_id_dari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Jabatan",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      komentar: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Komentar",
      tableName: "Komentars",
    }
  );
  return Komentar;
};
