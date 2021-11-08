const {
  login_cellphone,
  login_status,
  playlist_detail,
  song_url,
  user_account,
  user_playlist,
} = require("NeteaseCloudMusicApi");
const net163Model = require("../model/Net163.js");
const musicModel = require("../model/Music.js");

const getCookie = async () => {
  let cookieItem = await net163Model.findOne();
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
    await net163Model.deleteOne({ cookie: cookieItem.cookie });
    const res = await login_cellphone({
      phone: process.env.PHONE,
      password: process.env.NET163_PW,
    });
    const cookie = res.body.cookie;
    await net163Model.create({
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
      id: "6680040725",
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
    recordItem
      .map((i) => {
        const urlData = urlRes.body.data.find((e) => e.id === i.songId);
        if (urlData) {
          i.downloadUrl = urlData?.url;
          const msec = new Date().getTime();
          i.expi = msec + 500 * 1000; // expiresIn time number
        }
        return i;
      })
      .filter((i) => !!i?.downloadUrl)
      .forEach(async (item) => {
        if (!(await musicModel.exists({ songId: item.songId }))) {
          musicModel.create(item);
        }
      });
    return true;
  } catch (e) {
    /* handle error */
    console.log(e);
    return false;
  }
};

const getMyNet163AccountData = async (ctx) => {
  const cookie = await getCookie();
  const data = user_account({ cookie });
  const mySongCollection = user_playlist({
    cookie,
    uid: "308766059",
    includeVide: false,
  });

  ctx.api(
    200,
    { account: await data, collection: await mySongCollection },
    {
      code: 1,
      msg: "success",
    }
  );
};

const getSongUrl = async (id) => {
  const cookie = await getCookie();
  const urlData = await song_url({
    cookie,
    id,
  });
  return urlData.body.data[0].url;
};

module.exports = {
  getMySongsForAir,
  getMyNet163AccountData,
  getSongUrl,
};
