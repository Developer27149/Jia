const db = require("../utils/db.js");
const mongoose = require("mongoose");

const UserScheme = mongoose.Schema({
  username: String,
  password: String,
  intro: {
    type: String,
    default: "很酷😎",
  },
  email: String,
  likeWallpaperId: {
    type: [String],
    default: [],
  },
  uploadWallpaperId: {
    type: [String],
    default: [],
  },
});

module.exports = db.model("user", UserScheme);
