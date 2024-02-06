"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class INDIKATOR extends Model {
    static associate(models) {
      INDIKATOR.belongsTo(models.STRATEGI, {
        foreignKey: "strategi_id",
        as: "strategi",
      });
      INDIKATOR.hasMany(models.SIKOJA, {
        foreignKey: "indikator_id",
        as: "indikator",
      });
    }
  }
  INDIKATOR.init(
    {
      name: DataTypes.STRING,
      nomor: DataTypes.INTEGER,
      strategi_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "STRATEGIS",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "INDIKATOR",
      tableName: "INDIKATORS",
    }
  );
  return INDIKATOR;
};
