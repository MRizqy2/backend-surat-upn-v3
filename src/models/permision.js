"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permision extends Model {
    static associate(models) {
      Permision.belongsTo(models.Jabatan, {
        as: "jabatan",
        foreignKey: "jabatan_id",
      });
      Permision.hasOne(models.Akses_master, {
        foreignKey: "permision_id",
        as: "akses_master",
      });
    }
  }
  Permision.init(
    {
      jabatan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Jabatan",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      buat_surat: DataTypes.BOOLEAN,
      download_surat: DataTypes.BOOLEAN,
      generate_nomor_surat: DataTypes.BOOLEAN,
      upload_tandatangan: DataTypes.BOOLEAN,
      persetujuan: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Permision",
    }
  );
  return Permision;
};
