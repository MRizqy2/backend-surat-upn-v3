"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class INDIKATOR extends Model {
    static associate(models) {
      INDIKATOR.hasMany(models.REPO, {
        foreignKey: "indikator_id",
        as: "indikator",
      });
    }
  }
  INDIKATOR.init(
    {
      name: DataTypes.STRING,
      nomor: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "INDIKATOR",
      tableName: "INDIKATORS",
    }
  );
  return INDIKATOR;
};
