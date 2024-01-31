"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FAKULTAS extends Model {
    static associate(models) {
      FAKULTAS.hasMany(models.PRODI, { foreignKey: "fakultas_id" });
      // Fakultas.hasMany(models.Nomor_surat, { foreignKey: "fakultas_id" });
    }
  }
  FAKULTAS.init(
    {
      name: DataTypes.STRING,
      jenjang: DataTypes.STRING,
      kode_fakultas: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "FAKULTAS",
    }
  );
  return FAKULTAS;
};
