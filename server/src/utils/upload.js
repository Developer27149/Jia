const multer = require("@koa/multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public"));
  },
  filename: (req, file, cb) => {
    const splitArr = file.originalname.split(".");
    const type = splitArr[splitArr.length - 1];
    cb(null, `${file.filename}-${Date.now().toString(16)}.${type}`);
  },
});

// file upload restrictions
const limits = {
  fields: 10,
  fileSize: 5000 * 1024,
  files: 1,
};

const upload = multer({ storage, limits });

module.exports = upload;
