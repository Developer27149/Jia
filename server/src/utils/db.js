const Mongoose = require("mongoose");
const db = Mongoose.connect(process.env.DB_URI)

module.exports = db;
