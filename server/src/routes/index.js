const Router = require("@koa/router");
const { getWallpaper } = require("./controllers/wallpaper.js");

const router = new Router();
router.get("/", getWallpaper);

module.exports = router;
