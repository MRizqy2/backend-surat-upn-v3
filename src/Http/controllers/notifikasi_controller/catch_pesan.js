const { JABATAN, USERS, DAFTAR_SURAT, PRODI } = require("../../../models");

async function catchPesan(req, res) {
  try {
    let {
      surat_id,
      jabatan_id,
      isSign,
      persetujuan,
      isRead,
      isDownloadUnsigned,
    } = req.body;

    if (!isRead) isRead = false;
    if (!persetujuan || persetujuan == "") persetujuan = "";
    if (!isSign) isSign = false;
    if (!isDownloadUnsigned) isDownloadUnsigned = false;

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const user_surat = await USERS.findOne({
      where: { id: surat.user_id },
    });
    const jabatan_surat = await JABATAN.findOne({
      where: { id: user_surat.jabatan_id },
    });
    const prodi_surat = await PRODI.findOne({
      where: { id: user_surat.prodi_id },
    });
    const jabatan_user = await JABATAN.findOne({
      where: { id: jabatan_id },
    });
    const jabatan_atas = await JABATAN.findOne({
      where: { id: jabatan_user.jabatan_atas_id },
    });

    const isiPesan = [
      `Surat dari ${
        user_surat.prodi_id === 1 || !user_surat.prodi_id
          ? jabatan_surat.name
          : prodi_surat.name
      }`,
      `Surat diproses ${
        jabatan_user && jabatan_user.name ? jabatan_user.name : ""
      }`,
      `Surat di ${jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""}`,
      `Surat ditolak ${jabatan_user.name}`,
      `Surat diproses ke BSRE ${jabatan_user.name}`,
      `Surat telah ditandatangani`,
    ];

    if (isSign) {
      res = isiPesan[5];
    } else if (isDownloadUnsigned) {
      res = isiPesan[4];
    } else if (persetujuan) {
      if (persetujuan.toLowerCase().includes(`disetujui`)) {
        res = isiPesan[2];
      } else {
        res = isiPesan[3];
      }
    } else if (isRead) {
      res = isiPesan[1];
    } else {
      res = isiPesan[0];
    }
    return res;
  } catch (error) {
    console.error("Error:", error);
    return "Terjadi kesalahan";
  }
}

module.exports = catchPesan;
