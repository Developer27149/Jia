const musicModel = require("../../model/music.js");
const { getMySongsForAir } = require("../../utils/net163.js");

module.exports = {
  musicRandom: async (ctx) => {
    try {
      const { historyId = [] } = ctx.request.body;
      let res = await musicModel.findOne({ id: { $nin: historyId } });
      ctx.api(
        200,
        { res },
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
      console.log(data);
      ctx.api(200, data, {
        code: 1,
        msg: "success",
      });
    } catch (e) {
      /* handle error */
      console.log(e);
    }
  },
};
