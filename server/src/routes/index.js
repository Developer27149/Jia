const Router = require("@koa/router");
const {
  syncWallpaper,
  getWallpaperByPage,
  uploadWallpaper,
  downloadWallpaper,
  wallpaperScore,
  wallpaperSearchByKeywords,
  updateWallpaperTags,
  getWallpaperTags,
  getWallpaperTag,
  randomWallpaper,
} = require("./controllers/wallpaper.js");
const { musicRandom, syncMusicFromNet163 } = require("./controllers/music.js");

const router = new Router();
router.get("/wallpaper/page/:page", getWallpaperByPage);
router.get("/wallpaper/sync", syncWallpaper);
router.post("/wallpaper/score", wallpaperScore);
router.post("/wallpaper/search", wallpaperSearchByKeywords);
router.get("/wallpaper/tags/:id", getWallpaperTag);
router.get("/wallpaper/tags", getWallpaperTags);
router.put("/wallpaper/tags", updateWallpaperTags);
router.post("/wallpaper/random", randomWallpaper);
// upload route
router.post("/wallpaper/upload", uploadWallpaper);
router.get("/wallpaper/zip", downloadWallpaper);

// music router
router.post("/music/random", musicRandom);
router.get("/music/sync", syncMusicFromNet163);
module.exports = router;
