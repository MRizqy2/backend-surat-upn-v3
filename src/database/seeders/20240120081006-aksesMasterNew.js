"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "AKSES_MASTERS",
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
          sikoja: false,
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
          sikoja: false,
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
          sikoja: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          permision_id: 5,
          prodi: false,
          template: false,
          periode: false,
          fakultas: false,
          jabatan: false,
          jenis_surat: false,
          sikoja: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("AKSES_MASTERS", null, {});
  },
};
