const Router = require("@koa/router");
const {
  syncWallpaper,
  getWallpaperByPage,
  uploadWallpaper,
  downloadWallpaper,
} = require("./controllers/wallpaper.js");

const router = new Router();
router.get("/wallpaper/page/:page", getWallpaperByPage);
router.get("/wallpaper/sync", syncWallpaper);
// upload route
router.post("/wallpaper/upload", uploadWallpaper);
router.get("/wallpaper/zip", downloadWallpaper);

module.exports = router;
