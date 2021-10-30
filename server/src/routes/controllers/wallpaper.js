const WallpaperModel = require("../../model/Wallpaper.js");
const { getAllUnsplashWallpaper } = require("../../utils/unsplashApi.js");
const UploadHashModel = require("../../model/UploadHash.js");
const fs = require("fs");

const getWallpaperByPage = async (ctx) => {
  const { page = 1 } = ctx.params;
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
    let doc;
    const { hash, path } = ctx.request.files.file;
    const hashRecord = await UploadHashModel.findOne({ md5: hash });
    if (hashRecord) {
      // 删除刚刚收到的文件,否则创建新的哈希记录
      fs.rmSync(path);
    } else {
      doc = await UploadHashModel.create({ md5: hash });
    }
    ctx.api(
      200,
      { doc },
      {
        code: 1,
        msg: hashRecord ? "已存在" : "上传成功",
      }
    );
  } catch (e) {
    /* handle error */
    console.log(e);
    ctx.api(
      200,
      { doc: null },
      {
        code: -1,
        msg: "服务器异常,暂时无法上传图片",
      }
    );
  }
};

module.exports = {
  getWallpaperByPage,
  syncWallpaper,
  uploadWallpaper,
};
