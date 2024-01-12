"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role_user extends Model {
    static associate(models) {
      Role_user.hasMany(models.Notifikasi, { foreignKey: "role_id_dari" });
      Role_user.hasMany(models.Notifikasi, { foreignKey: "role_id_ke" });
      Role_user.hasMany(models.Users, { foreignKey: "role_id" });
      Role_user.hasMany(models.Komentar, { foreignKey: "role_id" });
    }
  }
  Role_user.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role_user",
      tableName: "Role_users",
    }
  );
  return Role_user;
};
