"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FOLDER extends Model {
    static associate(models) {
      FOLDER.hasMany(models.REPO, {
        foreignKey: "folder_id",
      });
    }
  }
  FOLDER.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "FOLDER",
      tableName: "FOLDERS",
    }
  );
  return FOLDER;
};
