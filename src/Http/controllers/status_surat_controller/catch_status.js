const {
  Daftar_surat,
  Template_surat,
  Jabatan,
  Users,
} = require("../../../models");

async function catchStatus(req, res) {
  const { jabatan_id, isRead, latestStatus, persetujuan, isSigned } = req.body;

  const jabatan = await Jabatan.findOne({
    where: { id: jabatan_id },
  });
  const jabatan_atas = await Jabatan.findOne({
    where: { id: jabatan.jabatan_atas_id },
  });
  console.log("myjkyu", jabatan.id);
  const isiStatus = [
    "",
    `Di Daftar Tunggu ${jabatan.name}`,
    `Diproses ${jabatan.name}`,
    `Di Daftar Tunggu ${
      jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""
    }`,
    `Diproses ${jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""}`,
    `Ditolak ${jabatan.name}`,
    `Ditolak ${jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""}`,
    "Surat Telah Ditandatangani",
  ];
  console.log("dawdawd");

  const statusMap = {
    [jabatan.id]: !isRead ? isiStatus[3] : isiStatus[2],
  };
  const updatedStatusMap = { ...statusMap };

  if (
    latestStatus == isiStatus[1] ||
    latestStatus == isiStatus[2] ||
    !latestStatus
  ) {
    if (persetujuan) {
      if (persetujuan.toLowerCase().includes(`disetujui`)) {
        updatedStatusMap[jabatan.id] = isiStatus[3];
        if (!jabatan_atas) {
          updatedStatusMap[jabatan.id] = persetujuan;
        }
      } else if (persetujuan.toLowerCase().includes(`ditolak`)) {
        updatedStatusMap[jabatan.id] = isiStatus[5];
      }
    } else if (isSigned) {
      return isiStatus[7];
    }

    console.log("tytntm");
    console.log("hhhhyyyy", updatedStatusMap[jabatan.id]);
    console.log("adsdw", latestStatus);

    if (latestStatus != updatedStatusMap[jabatan.id]) {
      //diproses TU != Disetujui Dekan
      console.log("bkpoerb");
      if (persetujuan) {
        return updatedStatusMap[jabatan.id] || "";
      } else if (!persetujuan && !isRead) {
        console.log("bkpoerb");
        return updatedStatusMap[jabatan.id] || "";
      }
      console.log("jajajaj", updatedStatusMap[jabatan.id]);
      return updatedStatusMap[jabatan.id] || "";
    }

    console.log("hhhhyyyy", updatedStatusMap[jabatan.id]);
  } else {
    return latestStatus;
  }
}

module.exports = catchStatus;
