"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "JENIS_SURATS",
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
    return queryInterface.bulkDelete("JENIS_SURATS", null, {});
  },
};
