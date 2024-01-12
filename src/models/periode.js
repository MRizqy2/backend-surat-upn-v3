"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Periode extends Model {
    static associate(models) {
      Periode.hasMany(models.Nomor_surat, { foreignKey: "periode_id" });
    }
  }
  Periode.init(
    {
      tahun: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Periode",
    }
  );
  return Periode;
};
