"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert("INDIKATORS", [
        {
          id: 1,
          name: "-",
          nomor: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      await queryInterface.bulkInsert("STRATEGIS", [
        {
          id: 1,
          name: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      await queryInterface.bulkInsert("IKUS", [
        {
          id: 1,
          name: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error in seeder:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("PERIODES", null, {});
  },
};
