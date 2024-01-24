"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = "12345";
    const hashedPassword = await bcrypt.hash(password, 10);
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 2,
          name: "Admin Prodi SD",
          email: "musa.jaelani@staff.upnjatim.ac.id",
          password: hashedPassword,
          jabatan_id: 2,
          prodi_id: 4,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Admin Prodi SI",
          email: "andri.lukyanto@staff.upnjatim.ac.id",
          password: hashedPassword,
          jabatan_id: 2,
          prodi_id: 3,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Admin Prodi IF",
          email: "edith.bertha@staff.upnjatim.ac.id",
          password: hashedPassword,
          jabatan_id: 2,
          prodi_id: 2,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Admin Prodi MTI",
          email: "marsono.fik@gmail.com",
          password: hashedPassword,
          jabatan_id: 2,
          prodi_id: 2,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Admin Prodi BD",
          email: "tu.fik.bd@gmail.com",
          password: hashedPassword,
          jabatan_id: 2,
          prodi_id: 2,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "Tata Usaha",
          email: "tu.fik@upnjatim.ac.id",
          password: hashedPassword,
          jabatan_id: 3,
          prodi_id: 1,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "Dekan",
          email: "novirina@upnjatim.ac.id",
          password: hashedPassword,
          jabatan_id: 4,
          prodi_id: 1,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: "Admin Dekan",
          email: "admin.dekan.fik@gmail.com",
          password: hashedPassword,
          jabatan_id: 5,
          prodi_id: 1,
          fakultas_id: 2,
          aktif: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
