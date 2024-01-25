require("dotenv").config();
const blob = require("@vercel/blob");

// Mengatur token untuk operasi membaca dan menulis blob
blob.setToken(process.env.BLOB_READ_WRITE_TOKEN);
