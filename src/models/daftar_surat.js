"use strict";
const { Model } = require("sequelize");
const komentar = require("./komentar");
module.exports = (sequelize, DataTypes) => {
  class DAFTAR_SURAT extends Model {
    static associate(models) {
      DAFTAR_SURAT.belongsTo(models.USERS, {
        foreignKey: "user_id",
        as: "user",
      });
      DAFTAR_SURAT.belongsTo(models.JENIS_SURAT, {
        foreignKey: "jenis_id",
        as: "jenis",
      });
      DAFTAR_SURAT.hasMany(models.KOMENTAR, {
        foreignKey: "surat_id",
        as: "komentar",
      });
      DAFTAR_SURAT.hasMany(models.NOTIFIKASI, {
        foreignKey: "surat_id",
        as: "notifikasi",
      });
      DAFTAR_SURAT.hasMany(models.NOMOR_SURAT, {
        foreignKey: "surat_id",
        as: "nomor_surat",
      });
      DAFTAR_SURAT.hasMany(models.TAMPILAN, {
        as: "tampilan",
        foreignKey: "surat_id",
      });
      DAFTAR_SURAT.hasOne(models.STATUS, {
        as: "status",
        foreignKey: "surat_id",
      });
      DAFTAR_SURAT.hasMany(models.AKSES_SURAT, {
        foreignKey: "surat_id",
        as: "akses_surat",
      });
    }
  }
  DAFTAR_SURAT.init(
    {
      judul: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      jenis_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
          model: "JENIS_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
          model: "USERS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      deskripsi: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DAFTAR_SURAT",
    }
  );
  return DAFTAR_SURAT;
};
