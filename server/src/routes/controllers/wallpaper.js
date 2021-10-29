const fs = require("fs");
const Shortuuid = require("shortuuid");
const fsPromise = fs.promises;
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
    let syncCount = 0;
    const taskArr = newData.map(async (item) => {
      const isExist = await WallpaperModel.exists({
        id: item.id,
      });
      if (!isExist) {
        return WallpaperModel.create(item);
      }
    });

    const taskResult = await Promise.all(taskArr);
    taskResult.forEach((i) => {
      console.log(i, "--".repeat(10));
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

const uploadWallpaper = async (ctx) => {
  // 获取文件,调用 unsplash 的接口上传文件,获取响应,返回结果
  try {
    console.log("ctx.request.file", ctx.request.file);
    console.log("ctx.file", ctx.file);
    console.log("ctx.request.body", ctx.request.body);
    ctx.request.files.forEach((file) => {
      const { name, size } = file;
      console.log(name, size);
    });
  } catch (e) {
    /* handle error */
    console.log(e);
  } finally {
    ctx.api(
      200,
      {},
      {
        code: 1,
        msg: "upload success",
      }
    );
  }
};

module.exports = {
  getWallpaperByPage,
  syncWallpaper,
  uploadWallpaper,
};
