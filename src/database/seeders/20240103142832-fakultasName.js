"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "FAKULTAS",
      [
        // {
        //   id: 1,
        //   name: "-",
        //   jenjang: "-",
        //   kode_fakultas: "-",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        {
          id: 2,
          name: "FAKULTAS ILMU KOMPUTER ",
          jenjang: "S1",
          kode_fakultas: "UN63.7",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("FAKULTAS", null, {});
  },
};
