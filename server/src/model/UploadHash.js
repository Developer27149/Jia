const db = require("../utils/db.js");
const mongoose = require("mongoose");
const uploadHashScheme = mongoose.Schema({
  hash: {
    type: String,
    require: true,
  },
  path: {
    type: String,
    require: true,
  },
});

module.exports = db.model("upload_hash", uploadHashScheme);
