"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class REPO extends Model {
    static associate(models) {}
  }
  REPO.init(
    {
      judul: DataTypes.STRING,
      jenis: DataTypes.STRING,
      data_user: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "REPO",
      tableName: "REPOS",
    }
  );
  return REPO;
};
