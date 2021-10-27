const Router = require("@koa/router");
const {
  syncWallpaper,
  getWallpaperByPage,
} = require("./controllers/wallpaper.js");

const router = new Router();
router.get("/wallpaper/page/:page", getWallpaperByPage);
router.get("/wallpaper/sync", syncWallpaper);

module.exports = router;
