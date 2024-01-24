"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jenis_surat extends Model {
    static associate(models) {
      Jenis_surat.hasMany(models.Daftar_surat, { foreignKey: "jenis_id" });
    }
  }
  Jenis_surat.init(
    {
      jenis: DataTypes.STRING,
      kode_jenis: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Jenis_surat",
    }
  );
  return Jenis_surat;
};
