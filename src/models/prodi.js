"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prodi extends Model {
    static associate(models) {
      Prodi.hasMany(models.Users, { foreignKey: "prodi_id" });
      // Prodi.hasMany(models.Periode, { foreignKey: "prodi_id" });
      Prodi.belongsTo(models.Fakultas, { foreignKey: "fakultas_id" });
    }
  }
  Prodi.init(
    {
      name: DataTypes.STRING,
      kode_prodi: DataTypes.STRING,
      fakultas_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Fakultas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Prodi",
    }
  );
  return Prodi;
};
