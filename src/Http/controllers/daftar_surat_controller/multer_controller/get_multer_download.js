const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

// Endpoint untuk mengunduh blob
const getDownloadBlob = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.resolve(
      __dirname,
      "../../../../../daftar_surat/",
      filename
    );

    // Baca file sebagai buffer
    const buffer = fs.readFileSync(filePath);
    console.log("jpvjqo", buffer);

    // Set appropriate headers for download
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Length", buffer.length);
    // res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Kirim buffer sebagai respons
    res.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/:filename", getDownloadBlob);

module.exports = router; // sek dilut cuy

// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const { StatusCodes } = require("http-status-codes");
// const router = express.Router();

// // Endpoint untuk mengunduh blob
// const getDownloadBlob = (req, res) => {
//   try {
//     const filename = req.params.filename;
//     const filePath = path.resolve(
//       __dirname,
//       "../../../../../daftar_surat/",
//       filename
//     );

//     const buffer = fs.readFileSync(filePath);

//     // Create a blob from the buffer
//     const blob = new Blob([buffer], { type: "application/pdf" });

//     // Set appropriate headers for download
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Length", blob.size);
//     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

//     // Send the blob data, triggering the download
//     res.send(buffer);
//   } catch (error) {
//     console.error("Error:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Internal Server Error" });
//   }
// };

// router.get("/:filename", getDownloadBlob);

// module.exports = router;

// const handleOpenFile = async () => {
//   const user = session.data?.user as User;
//   const token = user.accessToken;

//   const response = await axios.get(`${singleData?.url}`, {
//     responseType: "blob",
//     headers: {
//       "Content-Type": "application/pdf",
//       Authorization: "Bearer " + token,
//       "ngrok-skip-browser-warning": true,
//     },
//   });

//   const file = new Blob([response.data], { type: "application/pdf" });
//   const fileURL = URL.createObjectURL(file);
//   const pdfWindow = window.open() as Window;
//   pdfWindow.location.href = fileURL;
// };
