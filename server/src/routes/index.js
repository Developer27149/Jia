const Router = require("@koa/router");
const {
  syncWallpaper,
  getWallpaperByPage,
  uploadWallpaper,
} = require("./controllers/wallpaper.js");
const upload = require("../utils/upload.js");

const router = new Router();
router.get("/wallpaper/page/:page", getWallpaperByPage);
router.get("/wallpaper/sync", syncWallpaper);
router.post("/wallpaper/upload", upload.single("wallpaper"), uploadWallpaper);

module.exports = router;
