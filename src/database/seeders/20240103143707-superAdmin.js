// 20240103143707-superAdmin.js
"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const password = "admin";
      const hashedPassword = await bcrypt.hash(password, 10);

      await queryInterface.bulkInsert("JABATANS", [
        {
          id: 1,
          name: "Super Admin",
          jabatan_atas_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("PERMISIONS", [
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

      await queryInterface.bulkInsert("AKSES_MASTERS", [
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

      await queryInterface.bulkInsert("FAKULTAS", [
        {
          id: 1,
          name: "-",
          jenjang: "-",
          kode_fakultas: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("PRODIS", [
        {
          id: 1,
          name: "-",
          kode_prodi: "-",
          fakultas_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await queryInterface.bulkInsert("USERS", [
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
      await queryInterface.bulkDelete("JABATANS", null, {});
      await queryInterface.bulkDelete("PERMISIONS", null, {});
      await queryInterface.bulkDelete("AKSES_MASTERS", null, {});
      await queryInterface.bulkDelete("FAKULTAS", null, {});
      await queryInterface.bulkDelete("PRODIS", null, {});
      await queryInterface.bulkDelete("USERS", null, {});
    } catch (error) {
      console.error("Error in seeder rollback:", error);
    }
  },
};
