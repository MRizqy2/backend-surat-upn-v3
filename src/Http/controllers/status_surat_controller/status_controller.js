const {
  Daftar_surat,
  Template_surat,
  Role_user,
  Users,
} = require("../../../models");

const isiStatus = [
  "",
  "Di Daftar Tunggu TU",
  "Diproses TU",
  "Di Daftar Tunggu Dekan",
  "Diproses Dekan",
  "Di Daftar Tunggu Admin Dekan",
  "Diproses Admin Dekan",
  "Surat Telah diTandangan",
  "Ditolak TU",
  "Ditolak Dekan",
];

function getStatus(role_user, isRead, latestStatus, persetujuan) {
  const statusMap = {
    2: isiStatus[1],
    3: !isRead ? isiStatus[1] : isiStatus[2],
    4: !isRead ? isiStatus[3] : isiStatus[4],
    5: !isRead ? isiStatus[5] : isiStatus[6],
  };
  console.log("adkawind", latestStatus);
  let i, j;
  const updatedStatusMap = { ...statusMap }; // Create a copy of statusMap

  if (persetujuan) {
    if (
      persetujuan.includes("Disetujui TU") ||
      persetujuan.includes("Disetujui Dekan")
    ) {
      updatedStatusMap[3] = isiStatus[3];
      updatedStatusMap[4] = isiStatus[6];
    } else if (
      persetujuan.includes("Ditolak TU") ||
      persetujuan.includes("Ditolak Dekan")
    ) {
      updatedStatusMap[3] = isiStatus[8];
      updatedStatusMap[4] = isiStatus[9];
    }
  } else if (latestStatus === isiStatus[6] || latestStatus === isiStatus[5]) {
    return isiStatus[7];
  }

  console.log("tytntm");

  for (i = 0; i <= isiStatus.length; i++) {
    if (updatedStatusMap[role_user] == isiStatus[i]) {
      j = i;
      break;
    }
  }

  for (i = 0; i <= isiStatus.length; i++) {
    if (
      String(latestStatus).toLocaleLowerCase() ==
      String(isiStatus[i]).toLocaleLowerCase()
    ) {
      break;
    }
  }
  console.log("lmvpomr", j, i);
  if (j <= i && latestStatus) {
    return "";
  }
  console.log("hhhhyyyy");
  return updatedStatusMap[role_user] || "";
}

module.exports = getStatus;

// function getStatus(role_user, isRead, status, persetujuan) {
//   const statusMap = {
//     2: ["didaftar tunggu tu"],
//     3: !isRead ? ["didaftar tunggu tu"] : ["dibaca tu"],
//     4: !isRead ? ["didaftar tunggu dekan"] : ["dibaca dekan"],
//   };

//   const updatedStatusMap = { ...statusMap }; // Create a copy of statusMap

//   if (persetujuan) {
//     if (persetujuan.includes("setuju")) {
//       updatedStatusMap[3] = ["disetujui TU"];
//       updatedStatusMap[4] = ["disetujui Dekan"];
//     } else if (persetujuan.includes("tolak")) {
//       updatedStatusMap[3] = ["ditolak TU"];
//       updatedStatusMap[4] = ["ditolak Dekan"];
//     }
//   }

//   return updatedStatusMap[role_user] || [];
// }

// module.exports = getStatus;

// function getStatus(role_user) {
//   console.log(role_user);
//   if (role_user == 2) {
//     return "didaftar tunggu tu";
//   }
//   if (role_user == 2 && !isRead) {
//     return "didaftar tunggu tu";
//   } else if (role_user == 2 && isRead) {
//     return "dibaca tu";
//   } else if (role_user == 2 && isRead && persetujuan) {
//     return "disetujui tu";
//   } else if (role_user == 2 && isRead && !persetujuan) {
//     return "ditolak tu";
//   }
//   if (role_user == 4 && !isRead) {
//     return "didaftar tunggu dekan";
//   } else if (role_user == 4 && isRead) {
//     return "dibaca dekan";
//   } else if (role_user == 4 && isRead && persetujuan) {
//     return "disetujui dekan";
//   } else if (role_user == 4 && isRead && !persetujuan) {
//     return "ditolak dekan";
//   }
// }

// const status = [
//   "didaftar tunggu tu",
//   "dibaca tu",
//   "disetujui tu",
//   "tidak disetujui",
//   "didaftar tunggu dekan",
//   "dibaca dekan",
//   "disetujui dekan",
//   "ditolak dekan",
// ];

// function getStatus(user_id, surat_id) {
//   let index = 0;

//   const surat = Daftar_surat.findOne({
//     where: { id: surat_id },
//   });
//   surat.status = String(surat.status);
//   const user = Users.findOne({ where: { id: user_id } });

//   for (let i = 0; i < status.length(); i++) {
//     if (status[i] == surat.status) {
//       break;
//     }
//   }
//   //prodi
//   if (user.role_id == 3) {
//     return status[0];
//   }
//   //TU
//   else if (user.role_id == 2 && i < 1) {
//     return status[1];
//   } else if (user.role_id == 2 && i < 2) {
//   }
// }