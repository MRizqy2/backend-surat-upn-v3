"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("REPOS", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      surat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "DAFTAR_SURATS",
          key: "id",
        },
      },
      kode_url: {
        type: Sequelize.STRING,
      },
      strategi_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "STRATEGIS",
          key: "id",
        },
      },
      iku_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "IKUS",
          key: "id",
        },
      },
      indikator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "INDIKATORS",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("REPOS");
  },
};
