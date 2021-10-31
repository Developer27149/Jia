const db = require("../utils/db.js");
const mongoose = require("mongoose");

const UserScheme = mongoose.Schema({
  username: String,
  password: String,
  intro: String,
  email: String,
  likeWallpaperId: [String],
  uploadWallpaperId: [String],
});

module.exports = db.model("user", UserScheme);
