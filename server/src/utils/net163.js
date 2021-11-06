const {
  login_cellphone,
  user_subcount,
  login_status,
  user_account,
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
    console.log("ok.cookie is valid!");
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
  const cookie = await getCookie();
  const res = await user_subcount({
    cookie,
  });
  const account = await user_account({
    cookie,
  });
  console.log(account);
  return res;
};

module.exports = {
  getMySongsForAir,
};
