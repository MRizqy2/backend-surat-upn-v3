const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { DAFTAR_SURAT } = require("../../../models");
const { handleFileRequest } = require("./download_file_req");
const { handleZipRequest } = require("./download_zip_req");
const { handleExcelRequest } = require("./download_excel_req");
const { downloadAllUnsigned } = require("./download_all_unsigned");

router.post(`/file`, handleFileRequest);
router.post(`/zip`, handleZipRequest);
router.post("/excel", handleExcelRequest);
router.post(`/unsigned`, downloadAllUnsigned);

module.exports = router;
