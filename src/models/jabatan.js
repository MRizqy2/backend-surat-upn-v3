"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jabatan extends Model {
    static associate(models) {
      Jabatan.hasMany(models.Notifikasi, { foreignKey: "jabatan_id_dari" });
      Jabatan.hasMany(models.Notifikasi, { foreignKey: "jabatan_id_ke" });
      Jabatan.hasOne(models.Users, { foreignKey: "jabatan_id" });
      Jabatan.hasOne(models.Komentar, {
        foreignKey: "jabatan_id_ke",
        as: "komentar1",
      });
      Jabatan.hasOne(models.Komentar, {
        foreignKey: "jabatan_id_dari",
        as: "komentar2",
      });
      Jabatan.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_atas_id",
        as: "jabatan_atas",
      });
      Jabatan.hasOne(models.Permision, {
        foreignKey: "jabatan_id",
        as: "permision",
      });
    }
  }
  Jabatan.init(
    {
      name: DataTypes.STRING,
      jabatan_atas_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
          model: "Daftar_surat",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Jabatan",
      tableName: "Jabatans",
    }
  );
  return Jabatan;
};
