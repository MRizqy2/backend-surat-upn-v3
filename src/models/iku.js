"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IKU extends Model {
    static associate(models) {
      IKU.hasMany(models.REPO, {
        foreignKey: "iku_id",
      });
    }
  }
  IKU.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "IKU",
      tableName: "IKUS",
    }
  );
  return IKU;
};
