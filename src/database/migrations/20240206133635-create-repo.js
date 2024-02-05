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
      judul: {
        type: Sequelize.STRING,
      },
      jenis: {
        type: Sequelize.STRING,
      },
      data_user: {
        type: Sequelize.JSON,
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      url: {
        type: Sequelize.STRING,
      },
      folder_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "FOLDERS",
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
