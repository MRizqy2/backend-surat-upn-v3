const express = require("express");
const router = express.Router();
const { REPO, DAFTAR_SURAT } = require("../../../models");

async function get_file_path(url_code) {
  const repo = await REPO.findOne({ where: { url_code: url_code } });
  if (!repo) {
    return "File not found";
  }
  const path = await DAFTAR_SURAT.findOne({
    where: {
      id: repo.surat_id,
    },
  });
  return path.path;
}

router.get(`/`, async (req, res) => {
  try {
    let url_code = req.params.url_code;
    const path = await get_file_path(url_code);
    const filepath = path.resolve(__dirname, "../../../../", get_file_path);
    if (!fs.existsSync(filepath)) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
  // res.json({ message: "Hello from open access download" });
});

module.exports = router;
