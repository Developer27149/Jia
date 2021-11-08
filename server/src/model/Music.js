const mongoose = require("mongoose");
const db = require("../utils/db");

const musicScheme = mongoose.Schema({
  songName: {
    require: true,
    type: String,
  },
  songId: {
    require: true,
    type: String,
  },
  author: {
    require: true,
    type: String,
  },
  downloadUrl: {
    require: true,
    type: String,
  },
  expi: {
    require: true,
    type: Number,
  },
});

module.exports = db.model("music", musicScheme);
