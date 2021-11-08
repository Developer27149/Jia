const musicModel = require("../../model/Music.js");
const { getMySongsForAir } = require("../../utils/net163.js");

module.exports = {
  musicRandom: async (ctx) => {
    try {
      let res = await musicModel.find();
      if (res.length === 0)
        throw Error("Database is empty, I can not find a song");
      ctx.api(
        200,
        { song: res[~~Math.random(res.length)] },
        {
          code: res ? 1 : -1,
          msg: res ? "success" : "failed",
        }
      );
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
};
