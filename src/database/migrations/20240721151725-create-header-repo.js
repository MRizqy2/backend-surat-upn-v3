"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HEADER_REPOS", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judul: {
        type: Sequelize.BOOLEAN,
      },
      nomor_surat: {
        type: Sequelize.BOOLEAN,
      },
      pembuat_surat: {
        type: Sequelize.BOOLEAN,
      },
      tanggal_dibuat: {
        type: Sequelize.BOOLEAN,
      },
      jenis_surat: {
        type: Sequelize.BOOLEAN,
      },
      indikator: {
        type: Sequelize.BOOLEAN,
      },
      strategi: {
        type: Sequelize.BOOLEAN,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "USERS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("HEADER_REPOS");
  },
};
