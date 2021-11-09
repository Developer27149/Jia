const musicModel = require("../../model/Music.js");
const { getMySongsForAir, getSongUrl } = require("../../utils/net163.js");

module.exports = {
  musicRandom: async (ctx) => {
    try {
      let res = await musicModel.find();
      if (res.length === 0)
        throw Error("Database is empty, I can not find a song");
      let target = res[~~(Math.random() * res.length)];
      const curTime = new Date().getTime();
      if (curTime >= target.expi) {
        target.downloadUrl = await getSongUrl(target.songId);
        musicModel.findByIdAndUpdate(
          { _id: target._id },
          { downloadUrl: target.downloadUrl, expi: curTime + 1000 * 60 * 10 },
          {
            new: true,
          }
        );
      }
      ctx.api(200, target, {
        code: res ? 1 : -1,
        msg: res ? "success" : "failed",
      });
    } catch (e) {
      /* handle error */
      console.log(e);
      ctx.api(200, {}, { code: -1, msg: "failed" });
    }
  },
  syncMusicFromNet163: async (ctx) => {
    try {
      const data = await getMySongsForAir();

      ctx.api(
        200,
        {},
        {
          code: data ? 1 : -1,
          msg: data ? "success" : "failed",
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
  },
  getTargetSong: async (ctx) => {
    const id = ctx.params.id;
    const url = await getSongUrl(id);
    ctx.api(
      200,
      { url },
      {
        code: 1,
        msg: "success",
      }
    );
  },
};
