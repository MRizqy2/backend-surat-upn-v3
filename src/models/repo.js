"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Repo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Repo.init(
    {
      judul: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      tanggal: DataTypes.DATE,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Repo",
    }
  );
  return Repo;
};
