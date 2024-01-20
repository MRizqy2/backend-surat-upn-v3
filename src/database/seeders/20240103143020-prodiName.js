"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Prodis",
      [
        // {
        //   id: 1,
        //   name: "-",
        //   kode_prodi: "-",
        //   fakultas_id: 1,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        {
          id: 2,
          name: "Prodi IF",
          kode_prodi: "IF",
          fakultas_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Prodi SI",
          kode_prodi: "SI",
          fakultas_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Prodi SD",
          kode_prodi: "SD",
          fakultas_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   id: 5,
        //   name: "SD",
        //   kode_prodi: "SD",
        //   fakultas_id: 2,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 6,
        //   name: "MTI",
        //   kode_prodi: "MTI",
        //   fakultas_id: 2,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Prodis", null, {});
  },
};
