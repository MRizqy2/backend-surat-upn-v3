"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class REPO extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
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
    }
  );
  return REPO;
};
