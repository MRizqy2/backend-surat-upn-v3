"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_id",
        as: "jabatan",
      });
      Users.belongsTo(models.Prodi, { foreignKey: "prodi_id", as: "prodi" });
      Users.belongsTo(models.Fakultas, {
        foreignKey: "fakultas_id",
        as: "fakultas",
      });
      Users.hasMany(models.Daftar_surat, { foreignKey: "user_id" });
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
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
      prodi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Prodi",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
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
      aktif: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
