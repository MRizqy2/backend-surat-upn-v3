"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "JABATANS",
      [
        {
          id: 2,
          name: "Prodi",
          jabatan_atas_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Tata Usaha",
          jabatan_atas_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Dekan",
          jabatan_atas_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Admin Dekan",
          // jabatan_atas_id: ,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("JABATANS", null, {});
  },
};
