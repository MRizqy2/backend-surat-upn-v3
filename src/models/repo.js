"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class REPO extends Model {
    static associate(models) {
      REPO.belongsTo(models.FOLDER, {
        foreignKey: "folder_id",
      });
    }
  }
  REPO.init(
    {
      judul: DataTypes.STRING,
      jenis: DataTypes.STRING,
      data_user: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      url: DataTypes.STRING,
      folder_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "FOLDERS",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "REPO",
      tableName: "REPOS",
    }
  );
  return REPO;
};
