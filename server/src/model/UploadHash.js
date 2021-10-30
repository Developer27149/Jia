const db = require("../utils/db.js");
const mongoose = require("mongoose");
const uploadHashScheme = mongoose.Schema({
  md5: {
    type: String,
    require: true,
  },
});

module.exports = db.model("upload_hash", uploadHashScheme);
