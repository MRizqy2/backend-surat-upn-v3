require("dotenv").config();
const { put } = require("@vercel/blob");

module.exports = {
  uploadToVercel: async (stream, fileName, contentType) => {
    const result = await put(fileName, stream, {
      contentType,
      access: "public",
    });

    return result.url;
  },
};
