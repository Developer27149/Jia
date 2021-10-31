const mongoose = require("mongoose");
const db = require("../../utils/db.js");

const TagScheme = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  wallpaperIdArr: {
    type: [String],
    require: true,
  },
});

module.exports = db.model("wallpaper_tag", TagScheme);
