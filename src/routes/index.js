const express = require("express");
const cors = require("cors");
const authMiddleware = require("../Http/middleware/authMiddleware");
const authController = require("../Http/controllers/auth_controller/authentication_controller");
const daftarSuratController = require("../Http/controllers/daftar_surat_controller/daftar_surat_controller");
const fakultasController = require("../Http/controllers/fakultas_controller/fakultas_controller");
const jabatanController = require("../Http/controllers/jabatan_controller/jabatan_controller");
const prodiController = require("../Http/controllers/prodi_controller/prodi_controller");
const usersController = require("../Http/controllers/user_controller/user_controller");
const templateController = require("../Http/controllers/template_surat_controller/template_surat_controller");
const periodeController = require("../Http/controllers/periode_controller/periode_controller");
const jenisController = require("../Http/controllers/jenis_controller/jenis_controller");
const tampilanController = require("../Http/controllers/tampilan_surat_controller/tampilan_surat_controller");
const statusController = require("../Http/controllers/status_surat_controller/status_surat_controller");
const komentarController = require("../Http/controllers/komentar_controller/komentar_controller");
const repoController = require("../Http/controllers/repo_controller/repo_controller");
const aksesMasterController = require("../Http/controllers/akses_master_controller/akses_master_controller");
const permisionController = require("../Http/controllers/permision_controller/permision_controller");

// const nomorController = require("../Http/controllers/nomor_surat_controller");
// const notifikasiController = require("../Http/controllers/notifikasi_controller");

// const {
//   app: tampilanController,
// } = require("../Http/controllers/tampilan_surat_controller");
//masalah e export e objek
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// router.use(cors());
router.use("/akses-master", authMiddleware, aksesMasterController);
router.use("/permision", authMiddleware, permisionController);
router.use("/jabatan", authMiddleware, jabatanController);

router.use("/auth", authController);
router.use("/user", authMiddleware, usersController);
router.use("/periode", authMiddleware, periodeController);
router.use("/jenis", authMiddleware, jenisController);
router.use("/fakultas", authMiddleware, fakultasController);

router.use("/prodi", authMiddleware, prodiController);

router.use("/daftar-surat", authMiddleware, daftarSuratController);
router.use("/template-surat", authMiddleware, templateController);
router.use("/tampilan", authMiddleware, tampilanController);
router.use("/status", authMiddleware, statusController);
router.use("/komentar", authMiddleware, komentarController);

router.use("/repo", authMiddleware, repoController);

// router.use("/notifikasi", authMiddleware, notifikasiController);

// router.use("/nomor-surat", authMiddleware, nomorController);

module.exports = router;
