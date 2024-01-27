const express = require("express");
const cloudinary = require("../../../../config/cloudinaryConfig");
const { StatusCodes } = require("http-status-codes");
const { Daftar_surat } = require("../../../models");
const { PDFDocument } = require("pdf-lib");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isThumbnail = file.fieldname === "thumbnail";
    const destinationPath = isThumbnail
      ? "daftar_surat/thumbnail/"
      : "daftar_surat/";

    cb(null, destinationPath);
  },
  // filename: function (req, file, cb) {
  //   cb(null, req.body.judul + ".pdf");
  // },
  filename: function (req, file, cb) {
    // Gunakan judul sebagai nama file
    const judul = req.body.judul || "default";
    // console.log("Judul:", req);
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}-${judul}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const putSuratUrl = async (req, res, next) => {
  try {
    const { outputPath, surat_id } = req.save;

    // let suratUrl;
    // const judulFinal = path.basename(outputPath, path.extname(outputPath));
    const surat = await Daftar_surat.findOne({
      // coba run ciy p//inpo run
      where: { id: surat_id }, // inpu run maneh bang
    });
    const fileName = outputPath.split("\\").pop(); // aman ga file e
    console.log("fileName = ", fileName); //ga ke potong// aman tp link nge kurang /acc
    const fileBuffer = fs.readFileSync(outputPath);
    // const surat_judul = path.join(outputPath);
    // console.log("dadwawdaw", surat_judul);// file e rusak?//hmm// gk mending file e ta sg diwalik?
    // const judulFinal = path.basename(surat_judul);// kok acc maneh // salah judul sebelum e nek mana cuy

    // fileNameWithoutExtension = fileName.replace(".pdf", "-acc.pdf"); // Ganti ekstensi .pdf dengan -acc.pdf
    const judulExt = surat.judul;
    const judulFinal = judulExt.replace(".pdf", "-acc.pdf"); // iki sing
    // const suratUrl = `${req.files["surat"].filename}`;/isok kik/tak commit sek
    const downloadUrl = `${
      process.env.NGROK // coba cuy// iso  download kah?// mantap//oke;v
    }/daftar-surat/multer/download/${encodeURIComponent(fileName)}`; //malah gak masuk daftar surat njir
    console.log("dawdawda--------", downloadUrl); // qkqk
    // await new Promise((resolve, reject) => {//sek2 belum tak save semua file e
    //   cloudinary.uploader
    //     .upload_stream(
    //       {
    //         resource_type: getResourceType(outputPath),
    //         public_id: path.parse(outputPath),
    //       },
    //       (error, result) => {
    //         if (error) reject(error);
    //         else {
    //           suratUrl = result.url; //
    //           suratUrl = suratUrl.replace(/^http:/, "https:"); //lek ngene iso ga
    //           resolve(result);
    //         }// nek local kui kek opo yo
    //       }
    //     )
    //     .end(fileBuffer);
    // });tak tese/maksud?/mungkin iku
    //oke// gurung pindah route?// soale sing error tp\controllers\ocr_controller\put_surat_url.js:106:27// duduk multer
    //langsung //ohh kukira wes jalano maneh
    console.log("mdfvlp", judulFinal); //????

    const update_surat = await Daftar_surat.update(
      {
        judul: judulFinal,
        url: downloadUrl, //iki isine opo njir
      },
      {
        where: { id: surat_id },
        returning: true,
      }
    );

    return update_surat;
  } catch (error) {
    //nyimpen judul le salah
    console.error("Error:", error); // aman po?
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putSuratUrl);

module.exports = { router, putSuratUrl };
