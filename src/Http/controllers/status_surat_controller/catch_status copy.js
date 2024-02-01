const { JABATAN } = require("../../../models");

async function catchStatus(req, res) {
  const { jabatan_id, isRead, latestStatus, persetujuan, isSigned } = req.body;

  const jabatan = await JABATAN.findOne({
    where: { id: jabatan_id },
  });
  const jabatan_atas = await JABATAN.findOne({
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
  ]; // boleh//jenis_status?//boleh bole// catch_status opo catchStatus?//okee
  console.log("dawdawd"); //ga masuk perulangan e

  const statusMap = {
    //
    // [jabatan.id]: isiStatus[1],
    [jabatan.id]: !isRead ? isiStatus[3] : isiStatus[2],
  };
  const updatedStatusMap = { ...statusMap }; // Create a copy of statusMap

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
    //iki mbalek awal seh/bedanya apa njir/ tak coba e
    return isiStatus[7];
  }

  console.log("tytntm");
  console.log("hhhhyyyy", updatedStatusMap[jabatan.id]);
  console.log("adsdw", latestStatus);
  for (i = 4; i >= 3; i--) {
    //meet dc?/ok
    if (latestStatus.toLowerCase() == isiStatus[i].toLowerCase()) {
      //gas
      console.log("kmfbmpbmp");
      return latestStatus;
    }
  }

  if (latestStatus != updatedStatusMap[jabatan.id]) {
    //diproses TU != Disetujui Dekan
    console.log("bkpoerb");
    if (persetujuan) {
      return updatedStatusMap[jabatan.id] || "";
    } else if (!persetujuan && !isRead) {
      console.log("bkpoerb");
      return updatedStatusMap[jabatan.id] || "";
    }
    // else if (isRead) {
    //   console.log("k,j,y,");
    //   return updatedStatusMap[jabatan.id] || "";
    // }
    console.log("jajajaj", updatedStatusMap[jabatan.id]);
    return updatedStatusMap[jabatan.id] || "";
  } //Di Daftar Tunggu Dekan => Diproses Dekan

  // for (i = 0; i <= isiStatus.length; i++) {
  //   if (updatedStatusMap == isiStatus[i]) {
  //     j = i;
  //     break;
  //   }
  // }
  // console.log("lmvpomr", j, i);
  // if (j <= i && latestStatus) {
  //   return "";
  // }
  console.log("hhhhyyyy", updatedStatusMap[jabatan.id]);

  // return updatedStatusMap[jabatan.id] || ""; //ooo lek ngene iku updatedStatusMap[3] nah nak map iku gk ono 3
}

module.exports = catchStatus;
