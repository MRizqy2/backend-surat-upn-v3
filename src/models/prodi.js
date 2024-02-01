"use strict"; //inpo pindah .env
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PRODI extends Model {
    static associate(models) {
      PRODI.hasMany(models.USERS, { foreignKey: "prodi_id" });
      // Prodi.hasMany(models.Periode, { foreignKey: "prodi_id" });
      PRODI.belongsTo(models.FAKULTAS, { foreignKey: "fakultas_id" });
    }
  }
  PRODI.init(
    {
      name: DataTypes.STRING,
      kode_prodi: DataTypes.STRING,
      fakultas_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
          model: "FAKULTAS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "PRODI",
      tableName: "PRODIS",
    }
  );
  return PRODI;
};
