const request = require("./request.js");
const KEY = process.env.UNSPLASH_ACCESS_KEY;

module.exports = {
  getAllUnsplashWallpaper: async () => {
    try {
      const { data } = await request.get(
        `/collections/hkToSCaeZUE/?client_id=${KEY}`
      );
      const requestCount = Math.ceil(data["total_photos"] / 30);
      const promiseResArr = [...Array(requestCount)].map((_, idx) => {
        return request.get(
          `/collections/hkToSCaeZUE/photos?client_id=${KEY}&per_page=30&page=${
            idx + 1
          }`
        );
      });
      return Promise.allSettled(promiseResArr)
        .filter((i) => i.status === "fulfilled")
        .map((i) => i.value.data)
        .flat();
    } catch (e) {
      /* handle error */
      console.log(e);
    }
  },
};
