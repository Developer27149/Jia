const {
  login_cellphone,
  login_status,
  playlist_detail,
  song_url,
} = require("NeteaseCloudMusicApi");
const Net163Model = require("../model/Net163.js");

const getCookie = async () => {
  let cookieItem = await Net163Model.findOne();
  const isValid = await login_status({
    cookie: cookieItem?.cookie,
  });
  if (
    cookieItem &&
    isValid.status === 200 &&
    isValid?.body?.data?.account !== null
  ) {
    return cookieItem.cookie;
  } else {
    // delete old cookie and create a new item
    await Net163Model.deleteOne({ cookie: cookieItem.cookie });
    const res = await login_cellphone({
      phone: process.env.PHONE,
      password: process.env.NET163_PW,
    });
    const cookie = res.body.cookie;
    await Net163Model.create({
      cookie,
    });
    return cookie;
  }
};

const getMySongsForAir = async () => {
  try {
    const cookie = await getCookie();
    const res = await playlist_detail({
      cookie,
      id: "6921481649",
      n: "1000",
    });
    const playList = res.body.playlist.tracks;
    const recordItem = playList.map(({ name, id, ar }) => {
      return {
        songName: name,
        songId: id,
        author: ar.map((i) => i.name).join(","),
      };
    });
    const ids = recordItem.map((i) => i.songId).join();
    const urlRes = await song_url({ cookie, id: ids });
    const dbRes = await Net163Model.insertMany(
      recordItem
        .map((i) => {
          const urlData = urlRes.body.data.find((e) => e.id === i.songId);
          if (urlData) {
            i.downloadUrl = urlData?.url;
          }
          return i;
        })
        .filter((i) => !!i?.downloadUrl)
    );
    console.log(dbRes);
    if (dbRes) return true;
    return true;
  } catch (e) {
    /* handle error */
    console.log(e);
    return false;
  }
};

module.exports = {
  getMySongsForAir,
};
