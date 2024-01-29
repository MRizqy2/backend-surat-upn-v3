"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Periodes",
      [
        {
          id: 1,
          tahun: "2024-01-01 07:00:00+07",
          status: "true",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Periodes", null, {});
  },
};
