"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      for (let index = 1; index <= 14; index++) {
        await queryInterface.bulkInsert(
          "HEADER_DAFTAR_SURATS",
          [
            {
              id: index,
              judul: true,
              nomor_surat: true,
              pembuat_surat: true,
              tanggal_dibuat: true,
              jenis_surat: true,
              indikator: true,
              strategi: true,
              user_id: index,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
        await queryInterface.bulkInsert(
          "HEADER_REPOS",
          [
            {
              id: index,
              judul: true,
              nomor_surat: true,
              pembuat_surat: true,
              tanggal_dibuat: true,
              jenis_surat: true,
              indikator: true,
              strategi: true,
              user_id: index,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
      }
    } catch (error) {
      console.error("Error in seeder:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete("HEADER_DAFTAR_SURATS", null, {});
      await queryInterface.bulkDelete("HEADER_REPOS", null, {});
    } catch (error) {
      console.error("Error in seeder:", error);
    }
  },
};
