"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Permisions",
      [
        {
          id: 2,
          jabatan_id: 2,
          buat_surat: true,
          download_surat: true,
          generate_nomor_surat: false,
          upload_tandatangan: false,
          persetujuan: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          jabatan_id: 3,
          buat_surat: true,
          download_surat: true,
          generate_nomor_surat: false,
          upload_tandatangan: false,
          persetujuan: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          jabatan_id: 4,
          buat_surat: false,
          download_surat: false,
          generate_nomor_surat: true,
          upload_tandatangan: false,
          persetujuan: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          jabatan_id: 5,
          buat_surat: false,
          download_surat: true,
          generate_nomor_surat: false,
          upload_tandatangan: true,
          persetujuan: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Permisions", null, {});
  },
};
