"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      Status.belongsTo(models.Daftar_surat, { foreignKey: "surat_id" });
    }
  }
  Status.init(
    {
      surat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Daftar_surat",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: DataTypes.STRING,
      persetujuan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Status",
    }
  );
  return Status;
};
