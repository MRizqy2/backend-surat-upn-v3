"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HEADER_REPO extends Model {
    static associate(models) {
      HEADER_REPO.belongsTo(models.USERS, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  HEADER_REPO.init(
    {
      judul: DataTypes.BOOLEAN,
      nomor_surat: DataTypes.BOOLEAN,
      pembuat_surat: DataTypes.BOOLEAN,
      tanggal_dibuat: DataTypes.BOOLEAN,
      jenis_surat: DataTypes.BOOLEAN,
      indikator: DataTypes.BOOLEAN,
      strategi: DataTypes.BOOLEAN,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "USERS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "HEADER_REPO",
      tableName: "HEADER_REPOS",
    }
  );
  return HEADER_REPO;
};
