const fs = require("fs");
const Zip = require("jszip");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const addFolderFilesToZip = (folderPath, zipObj) => {
  const folderContent = fs.readdirSync(folderPath, {
    withFileTypes: true,
  });
  folderContent.forEach(({ name }) => {
    const _path = `${folderPath}/${name}`;
    if (fs.statSync(_path).isFile()) {
      zipObj.file(_path, fs.readFileSync(_path, "utf8"));
      // delete files
      process.env.MODE !== "dev" && fs.rmSync(_path);
    }
  });
};

const createToken = (payload = {}, expiresIn = "365 days") => {
  // sign(payload, secretOrPrivateKey, [option], callback)
  return jwt.sign(payload, process.env.JWT, {
    expiresIn,
  });
};

const verityToken = (token) => {
  return jwt.verify(token, process.env.JWT);
};

const createHashPassword = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};

module.exports = {
  generateZipFromFolder: async (folderPath) => {
    const zip = new Zip();
    addFolderFilesToZip(folderPath, zip);
    return zip.generateAsync({ type: "base64" });
  },
  createToken,
  verityToken,
  createHashPassword,
};
