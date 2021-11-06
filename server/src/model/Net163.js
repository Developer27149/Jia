const mongoose = require("mongoose");
const db = require("../utils/db.js");

const Net163Schema = mongoose.Schema({
  cookie: {
    require: true,
    type: String,
  },
});

module.exports = db.model("net163", Net163Schema);
