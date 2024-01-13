"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Komentar extends Model {
    static associate(models) {
      Komentar.belongsTo(models.Role_user, { foreignKey: "role_id" });
      Komentar.belongsTo(models.Daftar_surat, { foreignKey: "surat_id" });
    }
  }
  Komentar.init(
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
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Role_user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      komentar: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Komentar",
    }
  );
  return Komentar;
};
