const request = require("../utils/request.js");
const axios = require("axios");
const Router = require("@koa/router");
const {
  syncWallpaper,
  getWallpaperByPage,
} = require("./controllers/wallpaper.js");

const router = new Router();
router.get("/wallpaper/page/:page", getWallpaperByPage);
router.get("/wallpaper/sync", syncWallpaper);
router.get("/test", async (ctx) => {
  try {
    const res = await axios.get(
      `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
      {
        maxRedirects: 0,
        validateStatus: null,
      }
    );
    console.log(res);
    ctx.api(
      200,
      {
        res: res.data,
      },
      {
        code: 1,
        msg: "test api",
      }
    );
  } catch (e) {
    /* handle error */
    console.log(e);
  }
});

module.exports = router;
