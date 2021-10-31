const Mongoose = require("mongoose");
const db = require("../utils/db.js");

const wallpaperScheme = Mongoose.Schema({
  id: String,
  upload_at: String,
  likes: Number,
  width: Number,
  height: Number,
  description: String,
  urls: {
    raw: String,
    full: String,
    small: String,
  },
  upload_username: String,
});

// 创建模型
module.exports = db.model("wallpaper", wallpaperScheme);
