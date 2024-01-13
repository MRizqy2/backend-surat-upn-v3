const cloudinary = require("../../../../config/cloudinaryConfig");
const express = require("express");
const app = express.Router();
const { StatusCodes } = require("http-status-codes");
const { Template_surat, Jenis_surat } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

function getResourceType(filename) {
  const extension = path.extname(filename).toLowerCase();
  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".tiff",
    ".ico",
  ];
  const videoExtensions = [".mp4", ".avi", ".mov", ".flv", ".wmv", ".mkv"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "raw";
  }
}

app
  .get("/download/cloudinary", async function (req, res) {
    const { id } = req.query;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }

    const template_surat = await Template_surat.findOne({ where: { id: id } });

    if (!template_surat) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Template Surat not found" });
    }

    // const fileName = "newFileName.pdf"; // Ganti dengan nama file yang diinginkan
    const fileName = template_surat.judul;
    const downloadUrl = `${template_surat.url}?attachment=${encodeURIComponent(
      fileName
    )}`;

    // Download file dari Cloudinary
    const response = await fetch(downloadUrl);
    const fileBuffer = await response.buffer();

    const tempDir = "/tmp/template_surat";
    // Periksa apakah direktori sudah ada
    // if (!fs.existsSync(tempDir)) {
    //   // Jika tidak, buat direktori
    //   fs.mkdirSync(tempDir);
    // }
    if (!fs.existsSync(tempDir)) {
      // Jika tidak, buat direktori
      fs.promises.mkdirSync(tempDir, { recursive: true });
    }

    // Simpan file di server Anda
    // require("../../../../template_surat")
    // const filePath = "../../../../template_surat";
    // const filePath = "/tmp/template_surat/temp";
    const filePath = path.join(tempDir, fileName);
    // fs.writeFileSync(filePath, fileBuffer);
    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) throw err;
      console.log("File has been saved!");
    });

    // Kembalikan file kepada klien dengan nama yang diinginkan
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.download(filePath, fileName);
  })

  .get("/detail", async (req, res) => {
    res.json(await Template_surat.findOne({ where: { id: req.query.id } }));
  })

  .post(
    "/upload/cloudinary",
    upload.fields([
      { name: "surat", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    isAdmin,
    async function (req, res, next) {
      try {
        if (!req.files["surat"]) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Missing files in request" });
        }
        const { judul, deskripsi, jenis_id } = req.body;
        const jenis = await Jenis_surat.findOne({
          where: { id: jenis_id },
        });

        const judulEx =
          judul + path.extname(req.files["surat"][0].originalname);
        // const judul = req.files["surat"][0].originalname;
        // const judulCheck = await Template_surat.findOne({
        //   where: { judul_file },
        // });

        // if (judulCheck) {
        //   return res.json("judul/file sudah ada");
        // }

        let suratUrl;
        let thumbnailUrl;

        await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: getResourceType(req.files.surat[0].originalname),
                public_id: path.parse(req.files.surat[0].originalname),
              },
              (error, result) => {
                if (error) reject(error);
                else {
                  suratUrl = result.url;
                  resolve(result);
                }
              }
            )
            .end(req.files.surat[0].buffer);
        });

        // Upload thumbnail to Cloudinary
        if (req.files["thumbnail"]) {
          await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: getResourceType(
                    req.files.thumbnail[0].originalname
                  ),
                  public_id: path.parse(req.files.thumbnail[0].originalname),
                },
                (error, result) => {
                  if (error) reject(error);
                  else {
                    thumbnailUrl = result.url;
                    resolve(result);
                  }
                }
              )
              .end(req.files.thumbnail[0].buffer);
          });
        }

        const template_surat = await Template_surat.create({
          judul: judulEx,
          url: suratUrl,
          jenis_id: jenis.id || "",
          deskripsi: deskripsi || "",
          thumbnail: thumbnailUrl || "",
        });

        return res
          .status(StatusCodes.CREATED)
          .json({ message: "File successfully uploaded", template_surat });
      } catch (error) {
        console.error("Error:", error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  )

  .put(
    "/update/cloudinary",
    upload.fields([
      { name: "surat", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    isAdmin,
    async function (req, res, next) {
      try {
        const { judul, deskripsi } = req.body;
        const { id } = req.query;
        // const judul = req.files["surat"][0].originalname;
        const judulEx =
          judul + path.extname(req.files["surat"][0].originalname);
        const jenis = await Jenis_surat.findOne({
          where: { id: jenis_id },
        });
        // const judulCheck = await Template_surat.findOne({ where: { judul } });

        // if (judulCheck) {
        //   return res.json("judul/file sudah ada");
        // }
        // let judul;
        let suratUrl;
        let thumbnailUrl;

        if (req.files["surat"]) {
          // judul = req.files["surat"][0].originalname;
          await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: getResourceType(
                    req.files.surat[0].originalname
                  ),
                  public_id: path.parse(req.files.surat[0].originalname),
                },
                (error, result) => {
                  if (error) reject(error);
                  else {
                    suratUrl = result.url;
                    resolve(result);
                  }
                }
              )
              .end(req.files.surat[0].buffer);
          });
        }

        // Upload thumbnail to Cloudinary
        if (req.files["thumbnail"]) {
          await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: getResourceType(
                    req.files.thumbnail[0].originalname
                  ),
                  public_id: path.parse(req.files.thumbnail[0].originalname),
                },
                (error, result) => {
                  if (error) reject(error);
                  else {
                    thumbnailUrl = result.url;
                    resolve(result);
                  }
                }
              )
              .end(req.files.thumbnail[0].buffer);
          });
        }

        const data_template_surat = await Template_surat.findOne({
          where: { id },
        });
        if (!data_template_surat) {
          return res.status(404).json({ error: "Template surat not found" });
        }
        const template_surat = await Template_surat.update(
          {
            judul: judulEx,
            url: suratUrl || data_template_surat.url,
            jenis_id: jenis.id || "",
            deskripsi: deskripsi || "",
            thumbnail: thumbnailUrl || "",
          },
          {
            where: { id: id }, // Gantilah dengan kriteria yang sesuai
            returning: true, // Menambahkan opsi returning
          }
        );

        return res
          .status(StatusCodes.CREATED)
          .json({ message: "File successfully uploaded", template_surat });
      } catch (error) {
        console.error("Error:", error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  );

module.exports = app;
