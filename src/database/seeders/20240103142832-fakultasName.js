"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Fakultas",
      [
        {
          id: 1,
          name: "-",
          jenjang: "-",
          kode_fakultas: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Teknik Informatika",
          jenjang: "S1",
          kode_fakultas: "TI-S1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Fakultas", null, {});
  },
};
