const getWallpaper = async (ctx, next) => {
  const data = {
    keyword: "ok",
  };
  ctx.api(200, data, {
    code: 0,
    msg: "everything is ok",
  });
};

module.exports = {
  getWallpaper,
};
