const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const ExcelJS = require("exceljs");

router.get(`/`, async (req, res) => {
  // definisi data yang akan di export
  // ganti data dengan data dari database saat production
  const data_dumb = [
    {
      timestamp: "2021/08/01",
      nomor_surat_tugas: "020/UN63.7/TU-IF/2024",
      judul_surat_tugas: "PENGABDIAN MASYARAKAT DI DESA WARU SIDOARJO",
      program_studi: "Teknik Informatika",
      nomer_iku: 1,
      indikator: "Responden lulusan (Kerja / Studi Lanjut / Wirausaha)",
      catatan: "-",
      link: "https://www.google.com",
    },
    {
      timestamp: "2021/08/01",
      nomor_surat_tugas: "030/UN63.7/TU-IF/2024",
      judul_surat_tugas: "PENGABDIAN MASYARAKAT DI DESA WARU SIDOARJO",
      program_studi: "Teknik Informatika",
      nomer_iku: 3,
      indikator: "Mahasiswa MBKM di luar kampus inbound / outbond dan Mahasiswa Berprestasi",
      catatan: "-",
      link: "https://www.google.com",
    },
    {
      timestamp: "2023/08/01",
      nomor_surat_tugas: "020.1/UN63.7/TU-IF/2024",
      judul_surat_tugas: "PENGABDIAN MASYARAKAT DI DESA WARU SIDOARJO",
      program_studi: "Teknik Informatika",
      nomer_iku: 2,
      indikator: "Jumlah dosen kegiatan diluar kampus (Penelitian / Pengabdian Masyarakat / Praktisi)",
      catatan: "-",
      link: "https://www.google.com",
    },
  ];

  // persiapan file excel
  let counter = 1;
  const workbook = new ExcelJS.Workbook();
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.creator = "system";
  const worksheet = workbook.addWorksheet("Sheet1", { properties: { tabColor: { argb: "FFC0000" } } });

  // definisi kolom
  worksheet.columns = [
    { header: "NO", key: "no", width: 5, height: 20 },
    { header: "TIMESTAMP", key: "timestamp", width: 16 },
    { header: "NOMOR SURAT TUGAS", key: "nomor_surat_tugas", width: 31 },
    { header: "JUDUL SURAT TUGAS", key: "judul_surat_tugas", width: 32 },
    { header: "PROGRAM STUDI", key: "program_studi", width: 30 },
    { header: "NOMOR IKU", key: "nomer_iku", width: 16 },
    { header: "INDIKATOR 2024", key: "indikator", width: 60 },
    { header: "CATATAN", key: "catatan", width: 30 },
    { header: "LINK", key: "link", width: 35 },
  ];

  // isi data
  data_dumb.forEach((row, index) => {
    worksheet.addRow({
      no: index + 1,
      timestamp: row.timestamp,
      nomor_surat_tugas: row.nomor_surat_tugas,
      judul_surat_tugas: row.judul_surat_tugas,
      program_studi: row.program_studi,
      nomer_iku: row.nomer_iku,
      indikator: row.indikator,
      catatan: row.catatan,
      link: row.link,
    });
    counter++;
  });

  // styling column
  const columnAlignments = [
    { column: 1, alignment: { vertical: "middle", horizontal: "center", wrapText: true } },
    { column: 2, alignment: { vertical: "middle", horizontal: "right", wrapText: true } },
    { column: 3, alignment: { vertical: "middle", wrapText: true } },
    { column: 4, alignment: { vertical: "middle", wrapText: true } },
    { column: 5, alignment: { vertical: "middle", horizontal: "center", wrapText: true } },
    { column: 6, alignment: { vertical: "middle", horizontal: "center", wrapText: true } },
    { column: 7, alignment: { vertical: "middle", wrapText: true } },
    { column: 8, alignment: { vertical: "middle", horizontal: "center", wrapText: true } },
    { column: 9, alignment: { vertical: "middle", wrapText: true } },
  ];
  columnAlignments.forEach(({ column, alignment }) => {
    worksheet.getColumn(column).alignment = alignment;
  });

  // styling row
  worksheet.getRow(1).eachCell((cell) => {
    cell.style.font;
    cell.font = { size: 15, name: "Calibri" };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF9900" } };
    cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
  });
  worksheet.getRow(1).height = 40;
  for (let i = 2; i <= counter; i++) {
    // add border to each cell and change font
    worksheet.getRow(i).eachCell((cell) => {
      cell.font = { size: 11, name: "Courier New" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });
    // hyperlink
    worksheet.getCell(`I${i}`).value = {
      text: "Link download file",
      hyperlink: worksheet.getCell(`I${i}`).value,
    };
  }

  //save under export folder
  const filePath = path.join(__dirname, "../../../../", "export", "archive.xlsx");
  await workbook.xlsx.writeFile(filePath);
  res.download(filePath);
});

module.exports = router;
