const {} = require("")

const getWallpaperByPage = async (ctx) => {
  const {page} = ctx.request.body;
  const data = {
    wallpaper: await ,
  };
  ctx.api(200, data, {
    code: 0,
    msg: "everything is ok",
  });
};

module.exports = {
  getWallpaper,
};
