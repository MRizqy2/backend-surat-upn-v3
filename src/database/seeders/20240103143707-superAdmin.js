// 20240103143707-superAdmin.js
"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const password = "admin";
      const hashedPassword = await bcrypt.hash(password, 10);

      await queryInterface.bulkInsert("Jabatans", [
        {
          id: 1,
          name: "Super Admin",
          jabatan_atas_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("Permisions", [
        {
          id: 1,
          jabatan_id: 1,
          buat_surat: false,
          download_surat: false,
          generate_nomor_surat: false,
          upload_tandatangan: false,
          persetujuan: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("Akses_masters", [
        {
          id: 1,
          permision_id: 1,
          prodi: true,
          template: true,
          periode: true,
          fakultas: true,
          jabatan: true,
          jenis_surat: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("Fakultas", [
        {
          id: 1,
          name: "-",
          jenjang: "-",
          kode_fakultas: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("Prodis", [
        {
          id: 1,
          name: "-",
          kode_prodi: "-",
          fakultas_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("Users", [
        {
          id: 1,
          name: "Super Admin",
          email: "madehanindia.fik@upnjatim.ac.id",
          password: hashedPassword,
          jabatan_id: 1,
          prodi_id: 1,
          fakultas_id: 1,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error in seeder:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete("Jabatans", null, {});
      await queryInterface.bulkDelete("Permisions", null, {});
      await queryInterface.bulkDelete("Akses_masters", null, {});
      await queryInterface.bulkDelete("Fakultas", null, {});
      await queryInterface.bulkDelete("Prodis", null, {});
      await queryInterface.bulkDelete("Users", null, {});
    } catch (error) {
      console.error("Error in seeder rollback:", error);
    }
  },
};
