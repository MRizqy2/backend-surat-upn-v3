"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Akses_masters",
      [
        {
          id: 2,
          permision_id: 2,
          prodi: false,
          template: false,
          periode: false,
          fakultas: false,
          jabatan: false,
          jenis_surat: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          permision_id: 3,
          prodi: false,
          template: false,
          periode: false,
          fakultas: false,
          jabatan: false,
          jenis_surat: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          permision_id: 4,
          prodi: false,
          template: false,
          periode: false,
          fakultas: false,
          jabatan: false,
          jenis_surat: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Akses_masters", null, {});
  },
};
