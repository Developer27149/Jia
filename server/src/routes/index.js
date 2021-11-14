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
const {
  musicRandom,
  syncMusicFromNet163,
  getTargetSong,
} = require("./controllers/music.js");

const router = new Router();
router.post("/wallpaper/page", getWallpaperByPage);
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
router.get("/music/random", musicRandom);
router.get("/music/sync", syncMusicFromNet163);
router.get("/music/url/:id", getTargetSong);
module.exports = router;
