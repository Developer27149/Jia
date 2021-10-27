const WallpaperModel = require("../../model/Wallpaper.js");
const { getAllUnsplashWallpaper } = require("../../utils/unsplashApi.js");

const getWallpaperByPage = async (ctx) => {
  const { page } = ctx.request.body;
  const { limit = 10 } = ctx.query;
  const wallpapers = await WallpaperModel.find()
    .sort({ upload_at: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  ctx.api(200, wallpapers, {
    code: 0,
    msg: "everything is ok",
  });
};

const syncWallpaper = async (ctx) => {
  try {
    const unsplashWallpapers = await getAllUnsplashWallpaper();
    const newData = unsplashWallpapers.map(
      ({
        id,
        updated_at,
        likes,
        urls: { raw, full, small },
        description,
        width,
        height,
      }) => {
        return {
          upload_at: updated_at,
          likes,
          id,
          urls: { raw, full, small },
          description,
          width,
          height,
        };
      }
    );

    console.log(newData);

    let syncCount = 0;
    const taskArr = newData.map(async (item) => {
      const result = await WallpaperModel.exists({
        id: item.id,
      }).exec();
      if (result === null) {
        return WallpaperModel.create(item).exec();
      }
    });

    const taskResult = await Promise.all(taskArr);
    taskResult.forEach((i) => {
      if (i) syncCount++;
    });

    ctx.api(
      200,
      {
        syncCount,
      },
      {
        code: 0,
        msg: "ok",
      }
    );
  } catch (e) {
    /* handle error */
    console.log(e);
    ctx.api(
      500,
      {},
      {
        code: "-1",
        msg: "服务端异常",
      }
    );
  }
};

module.exports = {
  getWallpaperByPage,
  syncWallpaper,
};
