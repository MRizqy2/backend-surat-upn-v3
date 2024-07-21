"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HEADER_DAFTAR_SURAT extends Model {
    static associate(models) {
      HEADER_DAFTAR_SURAT.belongsTo(models.USERS, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  HEADER_DAFTAR_SURAT.init(
    {
      judul: DataTypes.BOOLEAN,
      nomor_surat: DataTypes.BOOLEAN,
      pembuat_surat: DataTypes.BOOLEAN,
      tanggal_dibuat: DataTypes.BOOLEAN,
      jenis_surat: DataTypes.BOOLEAN,
      indikator: DataTypes.BOOLEAN,
      strategi: DataTypes.BOOLEAN,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "USERS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "HEADER_DAFTAR_SURAT",
      tableName: "HEADER_DAFTAR_SURATS",
    }
  );
  return HEADER_DAFTAR_SURAT;
};
