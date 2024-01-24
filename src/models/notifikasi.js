"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifikasi extends Model {
    static associate(models) {
      Notifikasi.belongsTo(models.Daftar_surat, {
        foreignKey: "surat_id",
        as: "surat",
      });
      Notifikasi.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_id_dari",
        as: "pengirim",
      });
      Notifikasi.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_id_ke",
      });
    }
  }
  Notifikasi.init(
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
    },
    {
      sequelize,
      modelName: "Notifikasi",
      // tableName: "Notifikasis",
    }
  );
  return Notifikasi;
};
