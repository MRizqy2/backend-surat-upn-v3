"use strict";
const { Model } = require("sequelize");
const komentar = require("./komentar");
module.exports = (sequelize, DataTypes) => {
  class Daftar_surat extends Model {
    static associate(models) {
      Daftar_surat.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user",
      });
      Daftar_surat.belongsTo(models.Jenis_surat, {
        foreignKey: "jenis_id",
        as: "jenis",
      });
      Daftar_surat.hasMany(models.Komentar, {
        foreignKey: "surat_id",
        as: "komentar",
      });
      Daftar_surat.hasMany(models.Notifikasi, { foreignKey: "surat_id" });
      Daftar_surat.hasMany(models.Nomor_surat, {
        foreignKey: "surat_id",
        as: "nomor_surat",
      });
      Daftar_surat.hasMany(models.Tampilan, {
        as: "tampilan",
        foreignKey: "surat_id",
      });
      Daftar_surat.hasOne(models.Status, {
        as: "status",
        foreignKey: "surat_id",
      });
      Daftar_surat.hasMany(models.Akses_surat, {
        foreignKey: "surat_id",
        as: "akses_surat",
      });
    }
  }
  Daftar_surat.init(
    {
      judul: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      jenis_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
          model: "Jenis_surat",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
          model: "Users",
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
      modelName: "Daftar_surat",
    }
  );
  return Daftar_surat;
};
