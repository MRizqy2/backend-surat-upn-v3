"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert("STRATEGIS", [
        {
          id: 1,
          name: "Meningkatnya Kualitas Lulusan Pendidikan Tinggi",
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
      await queryInterface.bulkInsert("INDIKATORS", [
        {
          id: 1,
          name: "(UTAMA) Kesiapan Kerja Lulusan dalam kurun waktu 12 bulan setelah tanggal terbit ijazah, studi lanjut dan wiraswasta",
          strategi_id: 1,
          iku_id: 1,
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
