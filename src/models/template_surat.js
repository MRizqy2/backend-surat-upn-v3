"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Template_surat extends Model {
    static associate(models) {
      Template_surat.belongsTo(models.Jenis_surat, { foreignKey: "jenis_id" });
    }
  }
  Template_surat.init(
    {
      judul: DataTypes.STRING,
      lokasi: DataTypes.STRING,
      jenis_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Jenis_surat",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      thumbnail: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Template_surat",
    }
  );
  return Template_surat;
};
