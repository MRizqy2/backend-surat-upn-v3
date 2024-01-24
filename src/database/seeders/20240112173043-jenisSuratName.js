"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Jenis_surats",
      [
        {
          id: 1,
          jenis: "Surat Tugas",
          kode_jenis: "ST",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Jenis_surats", null, {});
  },
};
