const express = require("express");
const cors = require("cors");
const authMiddleware = require("../Http/middleware/authMiddleware");
const authController = require("../Http/controllers/auth_controller/authentication_controller");
const daftarSuratController = require("../Http/controllers/daftar_surat_controller/daftar_surat_controller");
const fakultasController = require("../Http/controllers/fakultas_controller/fakultas_controller");
const roleUserController = require("../Http/controllers/role_user_controller/role_user_controller");
const prodiController = require("../Http/controllers/prodi_controller/prodi_controller");
const usersController = require("../Http/controllers/user_controller/user_controller");
const templateController = require("../Http/controllers/template_surat_controller/template_surat_controller");
const periodeController = require("../Http/controllers/periode_controller/periode_controller");
const jenisController = require("../Http/controllers/jenis_controller/jenis_controller");

// const komentarController = require("../Http/controllers/komentar_controller");
// const nomorController = require("../Http/controllers/nomor_surat_controller");
// const notifikasiController = require("../Http/controllers/notifikasi_controller");

// const {
//   router: statusController,
// } = require("../Http/controllers/status_surat_controller");
// const {
//   app: tampilanController,
// } = require("../Http/controllers/tampilan_surat_controller");
//masalah e export e objek
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// router.use(cors());

router.use("/auth", authController);
router.use("/daftar-surat", authMiddleware, daftarSuratController);
router.use("/template-surat", authMiddleware, templateController);
router.use("/periode", authMiddleware, periodeController);
router.use("/jenis", authMiddleware, jenisController);
router.use("/fakultas", authMiddleware, fakultasController);
router.use("/role-user", authMiddleware, roleUserController);
router.use("/prodi", authMiddleware, prodiController);
router.use("/user", authMiddleware, usersController);

// router.use("/notifikasi", authMiddleware, notifikasiController);
// router.use("/komentar", authMiddleware, komentarController);
// router.use("/nomor-surat", authMiddleware, nomorController);
// router.use("/tampilan", authMiddleware, tampilanController);
// router.use("/status", authMiddleware, statusController);

module.exports = router;
