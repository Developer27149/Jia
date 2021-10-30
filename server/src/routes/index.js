const Router = require("@koa/router");
const {
  syncWallpaper,
  getWallpaperByPage,
  uploadWallpaper,
} = require("./controllers/wallpaper.js");

const router = new Router();
router.get("/wallpaper/page/:page", getWallpaperByPage);
router.get("/wallpaper/sync", syncWallpaper);
// upload route
router.post("/wallpaper/upload", uploadWallpaper);
router.post("/test", async (ctx) => {
  console.log(ctx.request.body);
  ctx.api(
    200,
    {},
    {
      code: 1,
      msg: "ok - test api",
    }
  );
});
module.exports = router;
