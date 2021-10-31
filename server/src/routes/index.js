const Router = require("@koa/router");
const {
  syncWallpaper,
  getWallpaperByPage,
  uploadWallpaper,
  downloadWallpaper,
  wallpaperScore,
  wallpaperSearchByDescription,
  updateWallpaperTags,
  getWallpaperTags,
} = require("./controllers/wallpaper.js");

const router = new Router();
router.get("/wallpaper/page/:page", getWallpaperByPage);
router.get("/wallpaper/sync", syncWallpaper);
router.post("/wallpaper/score", wallpaperScore);
router.post("/wallpaper/search", wallpaperSearchByDescription);
router.get("/wallpaper/tags/:id", getWallpaperTags);
router.put("/wallpaper/tags", updateWallpaperTags);
// upload route
router.post("/wallpaper/upload", uploadWallpaper);
router.get("/wallpaper/zip", downloadWallpaper);

module.exports = router;
