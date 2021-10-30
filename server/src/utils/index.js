const fs = require("fs");
const Zip = require("jszip");

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

module.exports = {
  generateZipFromFolder: async (folderPath) => {
    const zip = new Zip();
    addFolderFilesToZip(folderPath, zip);
    return zip.generateAsync({ type: "base64" });
  },
};
