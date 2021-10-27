//const Mongoose = require("mongoose");
//const db = Mongoose.connect(process.env.DB_URI, {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//});
//
//console.log(db);
//
//db.connection.on("open", () => {
//  console.log("Database connect success.");
//});
//
//db.connection.on("error", () => {
//  console.log("Database connect failed!");
//});
//
//module.exports = db;

//Import the mongoose module
var mongoose = require("mongoose");
//
////Set up default mongoose connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//
////Get the default connection
var db = mongoose.connection;
//
////Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("open", console.error.bind(console, "MongoDB connection success:"));

module.exports = db;
