"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Akses_masters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      permision_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Permisions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      prodi: {
        type: Sequelize.BOOLEAN,
      },
      template: {
        type: Sequelize.BOOLEAN,
      },
      periode: {
        type: Sequelize.BOOLEAN,
      },
      fakultas: {
        type: Sequelize.BOOLEAN,
      },
      jabatan: {
        type: Sequelize.BOOLEAN,
      },
      jenis_surat: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Akses_masters");
  },
};
