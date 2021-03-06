const WallpaperModel = require("../../model/Wallpaper.js");
const { getAllUnsplashWallpaper } = require("../../utils/unsplashApi.js");
const UploadHashModel = require("../../model/UploadHash.js");
const fs = require("fs");
const pathLib = require("path");
const { generateZipFromFolder, verityToken } = require("../../utils");
const TagModel = require("../../model/Tag.js");

const getWallpaperByPage = async (ctx) => {
  const { page = 1, limit = 10, sortType = "random" } = ctx.request.body;
  let sortObj;
  if (sortType === "newest") sortObj = { upload_at: 1 };
  if (sortType === "like") sortObj = { likes: 1 };
  if (sortType === "old") sortObj = { upload_at: -1 };
  if (sortType === "random") sortObj = null;
  const wallpapers = await WallpaperModel.find()
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  ctx.api(
    200,
    {
      wallpapers,
      nextPage: wallpapers.length < limit ? null : page + 1,
    },
    {
      code: 0,
      msg: "everything is ok",
    }
  );
};

const syncWallpaper = async (ctx) => {
  try {
    const unsplashWallpapers = await getAllUnsplashWallpaper();
    const newData = unsplashWallpapers.map(
      ({
        id,
        updated_at,
        urls: { raw, full, small },
        description,
        width,
        height,
      }) => {
        return {
          upload_at: updated_at,
          likes: 0,
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
        msg: "???????????????",
      }
    );
  }
};

const uploadWallpaper = async (ctx) => {
  // ????????????,?????? unsplash ?????????????????????,????????????,????????????
  try {
    let doc;
    const { hash, path } = ctx.request.files.file;
    const db_item = { hash, path };
    const hashRecord = await UploadHashModel.findOne(db_item);
    if (hashRecord) {
      // ???????????????????????????,??????????????????????????????
      fs.rmSync(path);
    } else {
      doc = await UploadHashModel.create(db_item);
    }
    ctx.api(
      200,
      { doc },
      {
        code: 1,
        msg: hashRecord ? "?????????" : "????????????",
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
        msg: "???????????????,????????????????????????",
      }
    );
  }
};

const downloadWallpaper = async (ctx) => {
  // ?????????????????????,?????????????????????,???????????????
  const oneItem = await UploadHashModel.findOne();
  console.log(oneItem);
  let zipAsBase64;
  if (oneItem) {
    const publicPath = pathLib.dirname(oneItem.path);
    zipAsBase64 = await generateZipFromFolder(publicPath);
  }
  ctx.api(
    200,
    {
      zipAsBase64,
    },
    {
      code: oneItem ? 1 : -1,
      msg: oneItem ? "????????????" : "?????????????????????",
    }
  );
};

const wallpaperScore = async (ctx) => {
  const { like, id } = ctx.request.body;
  const result = await WallpaperModel.findOneAndUpdate(
    { id },
    {
      $inc: {
        likes: like ? 1 : -1,
      },
    }
  );
  ctx.api(
    200,
    {},
    {
      code: result ? 1 : -1,
      msg: result ? "success" : "failed",
    }
  );
};

const wallpaperSearchByKeywords = async (ctx) => {
  const { keywordArr = [] } = ctx.request.body;
  const tasks = keywordArr.map(async (keyStr) => {
    const reg = new RegExp(`${keyStr}`);
    const resultWithDescription = await WallpaperModel.find({
      description: reg,
    });
    const tagResult = await TagModel.find({ name: reg }, "wallpaperIdArr");
    const wallpaperByTag = await WallpaperModel.find({
      id: { $in: tagResult.map((i) => i.wallpaperIdArr).flat() },
    });
    wallpaperByTag.forEach((i) => {
      if (resultWithDescription.every((j) => j.id !== i.id)) {
        resultWithDescription.push(i);
      }
    });
    return resultWithDescription;
  });

  const resultArr = await Promise.all(tasks);
  ctx.api(
    200,
    { result: resultArr.flat() },
    {
      code: 1,
      msg: "success",
    }
  );
};

const updateWallpaperTags = async (ctx) => {
  const { id, tags } = ctx.request.body;
  try {
    // create new tags
    tags.forEach(async (tag) => {
      if (!(await TagModel.findOne({ name: tag }))) {
        // create a new tag
        await TagModel.create({
          name: tag,
          wallpaperIdArr: [id],
        });
      }
    });
    // delete other tag id
    const matchTagArr = await TagModel.find({ wallpaperIdArr: { $in: [id] } });
    matchTagArr.forEach(async (item) => {
      if (!tags.includes(item.name)) {
        await TagModel.findOneAndUpdate(
          { name: item.name },
          {
            $set: {
              wallpaperIdArr: item.wallpaperIdArr.filter((i) => i !== id),
            },
          }
        );
      }
    });
    ctx.api(
      200,
      {},
      {
        code: 1,
        msg: "update success",
      }
    );
  } catch (e) {
    /* handle error */
    console.log(e);
    ctx.api(
      200,
      {},
      {
        code: -1,
        msg: "update failed.",
      }
    );
  }
};

const getWallpaperTag = async (ctx) => {
  const { id } = ctx.params;
  const result = await TagModel.find({ wallpaperIdArr: { $in: [id] } }, "name");
  console.log(result, id);
  const token = ctx.header.authorization.replace(/^Bearer /, "");
  console.log(verityToken(token));
  ctx.api(
    200,
    {
      result,
    },
    {
      code: 1,
      msg: "success",
    }
  );
};

const getWallpaperTags = async (ctx) => {
  try {
    const allTag = await TagModel.find();
    ctx.api(
      200,
      { tags: allTag },
      {
        code: 1,
        msg: "success",
      }
    );
  } catch (e) {
    /* handle error */
    console.log(e);
    ctx.api(
      200,
      {},
      {
        code: -1,
        msg: "failed",
      }
    );
  }
};

const randomWallpaper = async (ctx) => {
  try {
    const { historyId = [] } = ctx.request.body;
    const result = await WallpaperModel.findOne({ id: { $nin: historyId } });
    ctx.api(
      200,
      { result },
      {
        code: 1,
        msg: "success",
      }
    );
  } catch (e) {
    /* handle error */
    console.log(e);
    ctx.api(200, {}, { code: -1, msg: "failed" });
  }
};

module.exports = {
  getWallpaperByPage,
  syncWallpaper,
  uploadWallpaper,
  downloadWallpaper,
  wallpaperScore,
  wallpaperSearchByKeywords,
  updateWallpaperTags,
  getWallpaperTags,
  getWallpaperTag,
  randomWallpaper,
};
